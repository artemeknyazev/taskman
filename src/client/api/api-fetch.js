import 'isomorphic-fetch'

const API_URL = "http://localhost:8080/api"

const METHOD_GET = 'GET'
const METHOD_POST = 'POST'
const METHOD_PUT = 'PUT'
const METHOD_DELETE = 'DELETE'

const apiFetch = (
  url,
  method = 'GET',
  body = undefined,
) =>
  fetch(
    API_URL + url,
    {
      // TODO: check fields here!
      body: JSON.stringify(body),
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      method,
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
    }
  ).then(
    response => (
      response.json().then(
        ({ result }) => ({
          status: response.status,
          result,
        }),
        ({ error }) => ({
          status: response.status,
          error,
        })
      )
    ),
    error => ({
      error,
    })
  )

export const apiGet = (
  url
) =>
  apiFetch(
    url,
    METHOD_GET,
  )

export const apiPost = (
  url,
  data,
) =>
  apiFetch(
    url,
    METHOD_POST,
    data,
  )

export const apiPut = (
  url,
  data,
) =>
  apiFetch(
    url,
    METHOD_PUT,
    data,
  )

export const apiDelete = (
  url,
) =>
  apiFetch(
    url,
    METHOD_DELETE,
  )