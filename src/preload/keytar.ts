const keytar = require('keytar')

const SERVICE_NAME = 'agent-gpt-app'
const ACCOUNT_NAME = 'user-openai-key'

export async function saveUserKey(key: string) {
  try {
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, key)
    console.log('Key saved successfully.')
  } catch (error) {
    console.error('Error saving the key:', error)
  }
}

export async function getUserKey() {
  try {
    const key = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME)
    // console.log('Retrieved key:', key)
    return key
  } catch (error) {
    console.error('Error retrieving the key:', error)
  }
}
