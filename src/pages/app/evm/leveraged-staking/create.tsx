import { Create } from 'src/components/screens/Makai/Create'
import { EVMPageLayout } from 'src/contexts/StarlayContextProviderEVM'
import { NextPageWithLayout } from 'src/pages/_app'

const MakaiCreatePage: NextPageWithLayout = () => <Create />

MakaiCreatePage.getLayout = EVMPageLayout

export default MakaiCreatePage
