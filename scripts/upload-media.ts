import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { siteConfig } from '../lib/siteConfig'

const [, , localPath, key] = process.argv
if (!localPath || !key) {
  console.error('Usage: npm run media:upload -- <localPath> <key>')
  process.exit(1)
}

if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  console.error('Missing R2_ENDPOINT, R2_ACCESS_KEY_ID, or R2_SECRET_ACCESS_KEY environment variables.')
  process.exit(1)
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const ext = key.split('.').pop()?.toLowerCase()
const contentTypes: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
  ogg: 'audio/ogg',
  pdf: 'application/pdf',
  zip: 'application/zip',
}
const contentType = contentTypes[ext ?? ''] ?? 'application/octet-stream'

async function upload() {
  const body = await readFile(resolve(localPath!))
  await s3.send(new PutObjectCommand({
    Bucket: siteConfig.cloudflare.r2BucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  }))

  console.log(`Uploaded: ${siteConfig.mediaUrl}/${key}`)
}

upload().catch((err) => {
  console.error('Upload failed:', err)
  process.exit(1)
})
