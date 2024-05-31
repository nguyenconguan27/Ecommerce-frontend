import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
interface Props {
  children?: React.ReactNode
  breadTag?: String
}

export default function MainLayout({ children, breadTag }: Props) {
  return (
    <div>
      <Header breadTag={breadTag} />
      {children}
      <Footer />
    </div>
  )
}
