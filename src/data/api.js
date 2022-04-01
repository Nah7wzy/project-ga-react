import axios from 'axios';

const apiUrl = 'http://localhost:5000/cars/';


export const multipleFilesUpload = async (data, options) => {
    try {
        await axios.post(apiUrl + 'multipleFiles', data, options);
    } catch (error) {
        throw error;
    }
}
export const getMultipleFiles = async () => {
    try{
        const {data} = await axios.get(apiUrl + 'getMultipleFiles');
        return data;
    }catch(error){
        throw error;
    }
}

export const removeImageapi = async (filepath) => {
    try {
        axios.post(apiUrl + 'deleteImage', { filepath });
    } catch (error) {
        console.log(error)
    }
}

export const deleteCar = async (carId) => {
    try {
        await axios.post(apiUrl + 'deleteCar', { carId });
        console.log(carId)
    } catch (error) {
        console.log(error)
    }
}