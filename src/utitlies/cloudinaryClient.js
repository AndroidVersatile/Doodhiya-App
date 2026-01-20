import axios from 'axios';

export const cloudinaryClient = axios.create({
    timeout: 30000, // 30s for slow networks
    headers: {
        Accept: 'application/json',
    },
    // RN-specific: avoids some Android socket issues
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
});
