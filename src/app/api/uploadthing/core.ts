import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth, currentUser } from "@clerk/nextjs/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		// Set permissions and file types for this FileRoute
		.middleware(async ({ req }) => {
			const user = await currentUser();
			if (!user) {
				return { userId: null };
			}
			// This code runs on your server before upload
			const { userId } = auth();

			// If you throw, the user will not be able to upload
			if (!userId) throw new UploadThingError("Unauthorized");

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: userId };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			// !!! Whatever is returned here is sent to the client side `onClientUploadComplete` callback
			return {
				uploadedBy: metadata.userId,
				url: file.url,
			};
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
