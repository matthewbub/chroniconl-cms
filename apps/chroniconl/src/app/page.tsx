import BlogPostsGroup from '@/components/BlogPostsGroup'
import LatestHowToPosts from '@/components/LatestHowToPosts'
import PublicLayout from '@/components/PublicLayout'
import SubscribeToNewsletter from '@/components/SubscribeToNewsletter'
import { getAllPublishedPosts } from '@/server/getAllPublishedPosts'

export default async function Page() {
  const posts = await getAllPublishedPosts()
	
	const howToPosts = posts.reduce((acc, curr) => {
		if (curr?.tags?.length > 0) {
			const tag = curr?.tags[0]?.tag?.name
			if (tag === "how-to") {
				acc.push(curr)
			}
		}
		return acc
	}, [])

  return (
    <PublicLayout>
			<div className="w-full grid grid-cols-12 gap-4">
				<div className="col-span-12 md:col-span-6 lg:col-span-9">
					<BlogPostsGroup posts={posts} />
				</div>
				<div className="col-span-12 md:col-span-6 lg:col-span-3">
					<LatestHowToPosts posts={howToPosts} />
					<SubscribeToNewsletter />
				</div>
			</div>
    </PublicLayout>
  )
}
