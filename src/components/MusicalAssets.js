import Amplify from '@aws-amplify/core'
import '../style/MusicalAssets.css'
import { useEffect, useState } from 'react'
import axios from '../data/axios'

function MusicalAssets({ fetchUrl }) {
  const [music, setMusic] = useState([])
  const [userName, setUserName] = useState()

  useEffect(() => {
    async function fetchData() {
      const user = await Amplify.Auth.currentAuthenticatedUser()
      console.log('user', user)
      console.log('username', user.username)
      setUserName(user.username)
      const token = user.signInUserSession.idToken.jwtToken
      console.log('token', token)

      const request = await axios.get(fetchUrl, {
        headers: {
          Authorization: token,
        },
      })
      setMusic(request.data.musicalAsset)
      return request
    }
    fetchData()
  }, [fetchUrl])

  const handleClick = (item) => {
    let id = item.id
    console.log('Item', id)
  }

  return (
    <section className='musicalassets'>
      {/* <p className='username'>Hello, {userName}</p> */}
      <div className='assets'>
        {music.map((item) => (
          <div className='image-wrapper'>
            <img
              key={item.id}
              onClick={() => handleClick(item)}
              className={`musical-asset__poster`}
              src={`${item.artworkUrl}`}
              alt={item.name}
              style={{ width: '200px' }}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MusicalAssets
