import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../utils/config'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsOfCity } from '../redux/userSlice'

function useItemsByCity() {
  const dispatch = useDispatch()
  const { city, userData } = useSelector(state => state.user)
  useEffect(() => {
    if (userData?.role === "user" && city) {
      const fetchItems = async () => {
        const result = await axios.get(`${serverUrl}/api/item/getitemsbycity/${city}`, { withCredentials: true })
        dispatch(setItemsOfCity(result.data))
        console.log(result.data)
      }
      fetchItems()
    }
  }, [city, userData, dispatch])
}

export default useItemsByCity

