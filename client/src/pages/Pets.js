import React, { useState } from 'react'
import { useQuery } from 'react-query'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'
import { request, gql } from 'graphql-request'

const endpoint = 'http://localhost:4000'

export default function Pets() {
  const [modal, setModal] = useState(false)
  const { status, data, error, isFetching } = useQuery('data', async () => {
    const data = await request(
      endpoint,
      gql`
        query {
          pets {
            id
            name
            type
            img
          }
        }
      `
    )
    return data
  })

  console.log('Using useQuery from react-query, not from @apollo/react-hooks')
  console.log({ status, data, error, isFetching })

  const onSubmit = input => {
    setModal(false)
  }

  if (isFetching) {
    return <Loader />
  }

  if (error) {
    return <p>Error occurred: {error.message}</p>
  }

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  return (
    <div className='page pets-page'>
      <section>
        <div className='row betwee-xs middle-xs'>
          <div className='col-xs-10'>
            <h1>Pets</h1>
          </div>

          <div className='col-xs-2'>
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  )
}
