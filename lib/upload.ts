import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

function getS3Client() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (accountId == null) {
    throw new Error("Missing account ID.");
  }
  if (accessKeyId == null) {
    throw new Error("Missing access key ID.");
  }
  if (secretAccessKey == null) {
    throw new Error("Missing secret access key.");
  }

  return new S3Client({
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

async function normalizeImage(file: Blob) {
  const arrayBuffer = await file.arrayBuffer();
  return await sharp(arrayBuffer)
    .rotate() // autorotate to exif orientation
    .webp() // convert to webp
    .toBuffer();
}

export async function uploadImage(file: Blob) {
  const client = getS3Client();

  const key = `${randomUUID()}.webp`;
  await client.send(
    new PutObjectCommand({
      Key: key,
      Bucket: process.env.S3_BUCKET,
      ACL: "public-read",
      ContentType: "image/webp",
      Body: await normalizeImage(file),
    }),
  );
  return key;
}
