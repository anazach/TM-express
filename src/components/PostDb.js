import React, { useState } from 'react'
import '../style/Db.css'
import Amplify from '@aws-amplify/core'

export default function PostDb() {
  const [isPending, setIsPending] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [artist, setArtist] = useState('')
  const [mainArtist, setMainArtist] = useState(true)
  const [songwriter, setSongWriter] = useState('')
  const [producer, setProducer] = useState('')
  const [label, setLabel] = useState('')
  const [publisher, setPublisher] = useState('')
  const [artwork, setArtwork] = useState('')
  const [mp3, setMp3] = useState('')
  const [assetId, setAssetId] = useState('')
  const [token, setToken] = useState('')

  const authUser = async () => {
    const user = await Amplify.Auth.currentAuthenticatedUser()
    console.log('user', user)
    setToken(user.signInUserSession.idToken.jwtToken)
  }
  authUser();

  const handleSubmit = (e) => {
    e.preventDefault()

    const musicalAsset = {
      assetName: name,
      assetType: type,
      releaseYear: releaseYear,
      artistName: artist,
      mainArtist: mainArtist,
      songwriterName: songwriter,
      producerName: producer,
      labelName: label,
      publisherName: publisher,
    }

    setIsPending(true)
    console.log('New Asset: ', musicalAsset)

    fetch(
      '*',
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(musicalAsset),
      },
    )
      .then((response) => response.json())
      .then((response) => {
        let AssetID = response.musicalAssetId
        console.log('res', response)
        console.log('Data', response.musicalAssetId)
        setAssetId(AssetID)
        setIsPending(false)
        console.log('Asset created')
      })
      .catch((err) => console.log(err))
  }

  const AddImage = (e) => {
    e.preventDefault()

    const artWork = {
      artwork: artwork,
      musicalAssetId: assetId,
    }

    fetch(
      '*',
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(artWork),
      },
    )
      .then(() => {
        console.log('Image added')
      })
      .catch((error) => {
        console.log('ERROR', error)
      })
  }

  const AddMp3 = (e) => {
    e.preventDefault()
    
    const musicSnippet = {
      mp3: mp3,
      musicalAssetId: assetId,
    }

    fetch(
      '*',
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(musicSnippet),
      },
    ).then(() => {
      console.log('Mp3 added')
    })
  }

   const uploadImage = async (e) => {
     console.log(e.target.files[0])
     const file = e.target.files[0]
     const base64 = await convertBase64(file)
     setArtwork(base64)
   }

   const uploadMp3 = async (e) => {
     console.log(e.target.files[0])
     const file = e.target.files[0]
     const base64 = await convertBase64(file)
     setMp3(base64)
   }

   const convertBase64 = (file) => {
     return new Promise((resolve, reject) => {
       const fileReader = new FileReader()
       fileReader.readAsDataURL(file)

       fileReader.onload = () => {
         resolve(fileReader.result)
         console.log('Resolve: ', resolve)
       }

       fileReader.onerror = (error) => {
         reject(error)
         console.log('Error', error)
       }
     })
   }

  const handleMainArtistChange = (e) => {
    setMainArtist(e.target.value)
    console.log(strToBool(e.target.value))
    setMainArtist(strToBool(e.target.value))
  }

  const strToBool = (value) => {
    if (value && typeof value === 'string') {
      if (value === 'true') return true
      if (value === 'false') return false
    }
    return value
  }

  return (
    <section className='post'>
      <form onSubmit={handleSubmit} className='db-post-form'>
        <p>Name</p>
        <input
          type='text'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='input'
        />
        <p>Type</p>
        <select
          className='type'
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value='default'></option>
          <option value='song'>Song</option>
          <option value='album'>Album</option>
          <option value='ep'>EP</option>
          <option value='catalogue'>Catalogue</option>
        </select>
        <p>Release year</p>
        <input
          type='text'
          required
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          className='input'
        />
        <p>Artist</p>
        <input
          type='text'
          required
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className='input'
        />
        <div className='main-artist'>
          <label htmlFor='main' className='checkbox-container'>
            <input
              id='main'
              type='checkbox'
              value='true'
              checked={mainArtist === true}
              onChange={handleMainArtistChange}
            />
            <span className='checkmark'></span>
            <span className='label-main'>Main</span>
          </label>
          <label htmlFor='featured' className='checkbox-container'>
            <input
              id='featured'
              type='checkbox'
              value='false'
              checked={mainArtist === false}
              onChange={handleMainArtistChange}
            />
            <span className='checkmark'></span>
            <span className='label-featured'>Featured</span>
          </label>
        </div>
        <p>Songwriter</p>
        <input
          type='text'
          required
          value={songwriter}
          onChange={(e) => setSongWriter(e.target.value)}
          className='input'
        />
        <p>Producer</p>
        <input
          type='text'
          required
          value={producer}
          onChange={(e) => setProducer(e.target.value)}
          className='input'
        />
        <p>Label</p>
        <input
          type='text'
          required
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className='input'
        />
        <p>Publisher</p>
        <input
          type='text'
          required
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          className='input'
        />
        <article className='add-asset'>
          {!isPending && <button className='add-asset__btn'>Add Asset</button>}
          {isPending && <button className='add-asset__btn'>Adding...</button>}
        </article>
      </form>

      <section className='media'>
        <section className='add-image'>
          <form onSubmit={AddImage} className='db-post-form'>
            <label htmlFor=''>
              <p>Image</p>
            </label>
            <input type='file' required onChange={(e) => uploadImage(e)} />
            {artwork && (
              <img
                style={{
                  paddingTop: '40px',
                  width: '200px',
                  height: 'auto',
                  alignSelf: 'center',
                }}
                src={artwork}
                alt='Musical Asset Album Cover'
              />
            )}
            <article className='add-asset'>
              <button className='add-asset__btn'>Add image</button>
            </article>
          </form>
        </section>
        <section className='add-mp3'>
          <form onSubmit={AddMp3} className='db-post-form'>
            <label htmlFor=''>
              <p>Mp3</p>
            </label>
            <br />
            <input type='file' required onChange={(e) => uploadMp3(e)} />
            <article className='add-asset'>
              <button className='add-asset__btn'>Add Mp3</button>
            </article>
          </form>
        </section>
      </section>
    </section>
  )
}
