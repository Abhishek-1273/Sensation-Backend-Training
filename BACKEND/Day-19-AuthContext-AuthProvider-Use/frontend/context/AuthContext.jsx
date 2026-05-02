import { createContext, useContext, useState } from "react";
import api from "../src/api/api.js";

// create context
const AuthContext = createContext();

// create function that provide the context to whole application(global)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        const response = await api.post('/auth/signin', credentials);
        setUser(response.data.data)
        return response;
    }
    return (
        <AuthContext.Provider value={{user, login, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("context must be initialized")
    }
    return context;
}