import { FilterState } from "../../store/reducers/all/filter-slice";
import { UserInfo } from "../../store/reducers/all/mainPage-slice";
import instance from "./instans";


export const userApi = {
    search(filter: FilterState) {
        return instance.get('user/search', {
            params: {
                minAge: filter.minAge,
                maxAge: filter.maxAge,
                purpose: filter.purpose,
                location: filter.location,
                sortOrder: filter.sortOrder,
                offset: filter.offset,
                limit: filter.limit,
                sex: filter.sex,
                isBanned: false,
                searchQuery: filter.searchQuery,
    
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            })
        .then((response) => {
            return response.data;
        });
    },

    getBannedUserWithFiltr(filter: FilterState) {
        return instance.get('user/search', {
            params: {
                minAge: filter.minAge,
                maxAge: filter.maxAge,
                purpose: filter.purpose,
                location: filter.location,
                sortOrder: filter.sortOrder,
                offset: filter.offset,
                limit: filter.limit,
                sex: filter.sex,
                isBanned: true,
                searchQuery: filter.searchQuery,

            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            })
        .then((response) => {
            return response.data;
        });
    },

    uploadFile(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
    
        return instance.post('user/uploadedFile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            return response.data; // Ensure this returns the expected string (e.g., the uploaded file URL)
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            throw error; // Rethrow the error for proper error handling
        });
    },

    getProfile() {
        return instance.get('user/profile')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error('Error fetching user by ID:', error);
                throw error;   
            })
    },

    updateProfile(updateProfile: UserInfo) {
        return instance.post("user/update", updateProfile)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching user by ID:', error);
                throw error;   
            })
    },

    getById(_id: string) {
        return instance.get(`user/get/${_id}`)  
            .then(response => response.data) 
            .catch(error => {
                console.error('Error fetching user by ID:', error);
                throw error;
            });
    },

    likeIt(_id: string) {
        console.log(_id);
        return instance.post(`user/liked/${_id}`)  
            .then(response => response.data) 
            .catch(error => {
                console.error('Error liked user by ID:', error);
                throw error;
            });
    },

    removeLike(_id: string) {
        return instance.post(`user/unliked/${_id}`)  
            .then(response => response.data) 
            .catch(error => {
                console.error('Error unliked user by ID:', error);
                throw error;
            });
    },

    blockUser(_id: string) {
        return instance.post(`user/blocked/${_id}`)  
            .then(response => response.data) 
            .catch(error => {
                console.error('Error blocked user by ID:', error);
                throw error;
            });
    },

    unBlockUser(_id: string) {
        return instance.post(`user/unblocked/${_id}`)  
            .then(response => response.data) 
            .catch(error => {
                console.error('Error unblocked user by ID:', error);
                throw error;
            });
    },

    getUsers() {
        return instance.get('/user')
        .then(responce => responce.data);
    },

    getLike() {
        return instance.get('user/liked')
        .then(responce => responce.data);
    },

    getChat(_id: string) {
        return instance.get(`chat/${_id}`)
            .then((response) => {
                return response.data;
            })
    },
    sendMessage(_id: string) {
        return instance.get(`chat/${_id}`)
            .then((response) => {
                return response.data;
            })
    },
    updateMessage(_id: string, content: string) {
        return instance.post(`chat/update/${_id}`, {content: content} )
            .then((response) => {
                return response.data;
            })
    },
    deleteMessage(_id: string) {
        return instance.post(`chat/delete/${_id}`)
            .then((response) => {
                return response.data;
            })
    },

    getNotification() {
        return instance.get(`/notification`)
            .then((response) => {
                return response.data;
            })
    },

    getChatsUser() {
        return instance.get(`user/chats`)
            .then((response) => {
                return response.data;
            })
    },


    openNotification(_id: string) {
        return instance.post(`notification/open/${_id}`)
            .then((response) => {
                return response.data;
            })
    },


    deleteNotification(_id: string) {
        return instance.post(`notification/delete/${_id}`)
            .then((response) => {
                  return response.data;
            })
    },

    deleteCahts(_id: string) {
        return instance.post(`user/chats/delete/${_id}`)
            .then((response) => {
                  return response.data;
            })
    },

    getUnreadNotification(){
        return instance.get(`notification/getUnreadNotification`)
            .then((response) => {
                return response.data;
            })
    },

    deleteProfile() {
        return instance.post(`user/deleteProfile`)
            .then((response) => {
                  return response.data;
            })
    },

}


