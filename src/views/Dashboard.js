import React from 'react'
import MusicalAssets from '../components/MusicalAssets'
import requests from '../data/requests'

function Dashboard() {
  return (
    <>
      <section className='library'>
        <div className='wrapper'>
          <MusicalAssets
            fetchUrl={requests.fetchHello}
            title={'Musical Assets'}
          />
        </div>
      </section>
    </>
  )
}

export default Dashboard