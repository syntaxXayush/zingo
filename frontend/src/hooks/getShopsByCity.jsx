import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../utils/config'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsOfCity } from '../redux/userSlice'

function useGetShopsByCity() {
const dispatch = useDispatch()
const { city, userData } = useSelector(state => state.user)
useEffect(() => {
    if (userData?.role === "user" && city) {
        const fetchShops = async () => {
            const result = await axios.get(`${serverUrl}/api/shop/getshopsbycity/${city}`, { withCredentials: true })
            dispatch(setShopsOfCity(result.data))
        }
        fetchShops()
    }
}, [city, userData])
}

export default useGetShopsByCity

