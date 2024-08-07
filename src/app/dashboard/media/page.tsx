export const fetchCache = 'force-no-store'

import MediaView from '@/app/dashboard/media/_media_components/MediaView'
import { supabase } from '@/utils/supabase'

const fetchData = async () => {
  if (!process.env.UPLOADTHING_SECRET) {
    return
  }

  const response = await fetch('https://uploadthing.com/api/listFiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Uploadthing-Api-Key': process.env.UPLOADTHING_SECRET,
      'X-Uploadthing-Version': '6.4.0',
    },
    body: JSON.stringify({}),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch media')
  }

  const data = await response.json()

  return data
}

export default async function Media() {
  const data = await fetchData()

  return (
    <section>
      <MediaView media={data?.files} />
    </section>
  )
}
