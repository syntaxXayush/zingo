import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./userSlice"

const store = configureStore({
    reducer: {
        user: userSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'user/setSocket',
                    'user/setUserData',
                    'user/setShopsOfCity',
                    'user/setItemsOfCity',
                    'user/setSearchItems'
                ],
                ignoredPaths: ['user.socket']
            }
        })
})

export default store