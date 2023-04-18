import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb'
import { compare } from 'bcryptjs';



const mongoUri = process.env.MONGO_URI

async function verifyCredentials(email, password) {
    console.log('Estabelecendo conexão com o banco de dados...')
    const client = new MongoClient(mongoUri, { useUnifiedTopology: true })

    try {
        await client.connect()
        console.log('Conexão com o banco de dados estabelecida!')
        const db = client.db()
        const collection = db.collection('users')

        const user = await collection.findOne({ email })


        if (!user) return null

        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) return null

        // Remova a senha do objeto do usuário antes de retorná-lo
        delete user.password

        return user

    } catch (error) {
        console.log(error)
    } finally {
        await client.close()
    }
}
export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            authorize: async (credentials) => {

                const user = await verifyCredentials(credentials.email, credentials.password)
                user.name = user.username
                delete user.username

                user.id = user._id.toString()
                delete user._id



                if (user) {

                    return Promise.resolve(user)
                }
            },
        }),
    ],
    secret: "D/j+t0NMMrECERXR1nRWlnQC+bU1K4NuaDOpov3P8Tc=",
    session: {
        jwt: true,

    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id

            }

            return token
        },
        async session({ session, token }) {
            session.user = token

            return session
        },
    },


})