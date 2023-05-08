import React from 'react'
import { HeaderElement } from '../types/header'
import { useRouter } from '../hooks/useRouter'
import logo from '../assets/log-place2.png';


interface HeaderProps {
  HeaderContent: HeaderElement[]
}

const Header: React.FC<HeaderProps> = ({ HeaderContent }) => {
  const { currentPath, routeTo } = useRouter()

  const HeaderMenuClickHandler = (path: string) => {
    // 헤더 메뉴 클릭시 이벤트 처리
    routeTo(path)
  }

  return (
    <nav className="sticky top-0 w-full h-36 border-b bg-white">
      <div className="justify-center flex h-full items-center">
        <div><a href='/'><img src={logo} alt="logo" /></a></div>
        {HeaderContent.map((element) => {
          return (
            <div
              key={element.path}
              className={currentPath === element.path ? 'header-menu selected ml-12 text-3xl font-sans cursor-pointer text-purple-400' : 'header-menu ml-12 text-3xl font-sans cursor-pointer'}
              onClick={() => HeaderMenuClickHandler(element.path)}>
              {element.label}
            </div>
          )
        })
        }

      </div>
    </nav>)
}

export default Header
