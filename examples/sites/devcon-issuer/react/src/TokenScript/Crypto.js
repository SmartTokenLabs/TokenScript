export const generateKey = async () => {
  return window.crypto.subtle.generateKey({
    name: 'AES-GCM',
    length: 256,
  }, true, ['encrypt', 'decrypt'])
}

export const encode = (data) => {
  const encoder = new TextEncoder()
  return encoder.encode(data)
}

export const generateIv = () => {
  return window.crypto.getRandomValues(new Uint8Array(12))
}

export const encrypt = async (data, key) => {
  const encoded = encode(data)
  const iv = generateIv()
  const cipher = await window.crypto.subtle.encrypt({
    name: 'AES-GCM',
    iv: iv,
  }, key, encoded)

  return {
    cipher,
    iv,
  }
}

export const pack = (buffer) => {
  return window.btoa(
    String.fromCharCode.apply(null, new Uint8Array(buffer))
  )
}

export const unpack = (packed) => {
  const string = window.atob(packed)
  const buffer = new ArrayBuffer(string.length)
  const bufferView = new Uint8Array(buffer)

  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i)
  }

  return buffer
}

export const decode = (bytestream) => {
  const decoder = new TextDecoder()

  return decoder.decode(bytestream)
}

export const decrypt = async (cipher, key, iv) => {
  const encoded = await window.crypto.subtle.decrypt({
    name: 'AES-GCM',
    iv: iv,
  }, key, cipher)

  return decode(encoded)
}
