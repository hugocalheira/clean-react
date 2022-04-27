import React, { memo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/presentation/components'
import { ApiContext } from '@/presentation/contexts'
import Styles from './header-styles.scss'

const Header: React.FC = () => {
  const { setCurrentAccount } = useContext(ApiContext)
  const navigate = useNavigate()

  const logout = (e: React.MouseEvent): void => {
    e.preventDefault()
    setCurrentAccount(null)
    navigate('/login', { replace: true })
  }

  return (
    <header className={Styles.headerWrap}>
        <div className={Styles.headerContent}>
            <Logo />
            <div className={Styles.logoutWrap}>
                <span>Hugo</span>
                <a data-testid='logout' onClick={logout} href="#">sair</a>
            </div>
        </div>
    </header>
  )
}

export default memo(Header)
