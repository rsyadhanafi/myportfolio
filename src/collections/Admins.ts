import type { Access, CollectionConfig } from 'payload'

const isPayloadAdmin: Access = ({ req }) => req.user?.collection === 'admins'

const allowFirstAdminOnly: Access = async ({ req }) => {
  if (req.user?.collection === 'admins') return true
  const existingAdmins = await req.payload.count({
    collection: 'admins',
    overrideAccess: true,
  })
  return existingAdmins.totalDocs === 0
}

export const Admins: CollectionConfig = {
  slug: 'admins',
  access: {
    create: allowFirstAdminOnly,
    delete: isPayloadAdmin,
    read: isPayloadAdmin,
    update: isPayloadAdmin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email & password ditambahkan otomatis oleh auth: true
  ],
  versions: false,
}