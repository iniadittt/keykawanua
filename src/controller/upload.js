import { Storage } from '@google-cloud/storage'
import path, { dirname, join } from 'path'
import { fileURLToPath } from 'url';
import Photos_kawanua from '../models/uploadModels.js'
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const keyFilename = path.join(__dirname, '../../key.json')
const GCS = new Storage({ keyFilename })
const bucketName = 'storage-user-kawanua'


export const createUpload = async(req, res) => {
    const file = req.file
    if (!file) return res.status(400).json({ message: 'Tidak ada foto yang diunggah' })
    const filename = file.filename
    const filePath = path.join(__dirname, '../../uploads', filename)
    const fileName = path.basename(filePath)
    const destFileName = `services/${fileName}`
    await GCS.bucket(bucketName).upload(filePath, { destination: destFileName, })
    const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`
    const uploadDataToDatabase = await Photos_kawanua.create({
        photo_id: uuidv4(),
        photo_url: url,
        upload_date: new Date()
    })

    if (!uploadDataToDatabase) return res.status(400).json({ message: 'Gagal upload foto ke database' })
    return res.status(200).json({ message: 'Berhasil upload image', url })

}