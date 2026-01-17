import API from "./api"

// search user by / name / email / id /
export const searchUser = (search) => {
    return API.get("/v1/users",{
        params: { Email: search },
    });
};

export const UpdateUserRoles = (userId, roles) => {
    return API.put(`/v1/users/${userId}/roles`,{
        roles,
    });
};
