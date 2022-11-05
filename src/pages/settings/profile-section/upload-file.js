import { axiosAuthInstance } from '@utils/axios-instances';
import axios from 'axios';
export async function uploadToS3({ fileType, fileContents, }) {
    const presignedPostUrl = await getPresignedPostUrl(fileType);
    const formData = new FormData();
    formData.append('Content-Type', fileType);
    Object.entries(presignedPostUrl.fields).forEach(([k, v]) => {
        formData.append(k, v);
    });
    formData.append('file', fileContents); // The file must be the last element
    const response = await axios.post(presignedPostUrl.url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return presignedPostUrl.filePath;
}
async function getPresignedPostUrl(fileType) {
    const { data: presignedPostUrl, } = await axiosAuthInstance.get(`/get-presigned-url-s3?fileType=${fileType}`);
    return presignedPostUrl;
}
