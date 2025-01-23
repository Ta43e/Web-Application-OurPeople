import instance from "./user/instans";


export const adminApi = {
    getBannedUsers() {
        return instance.get(`/admin`)
            .then((response) => {
                  return response.data;
            })
    },
    getInfoAboutBannedUser(_id: string) {
        return instance.get(`admin/banInfo/${_id}`)
            .then((response) => {
                  return response.data.message;
            })
    },

    bannedUser(_id: string, message: string) {
        return instance.post(`admin/ban/${_id}`, {message})
            .then((response) => {
                return response.data;
        })
    },
    unBanUser(_id: string) {
        return instance.post(`admin/unBan/${_id}`)
            .then((response) => {
                  return response.data;
            })
    },
    checkBanned() {
        return instance.get(`user/checkBan`)
        .then((response) => {
                console.log(response.data)
              return response.data;
        })
    }
}
