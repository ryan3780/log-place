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
    <nav className="sticky top-0 w-full h-20 border-b bg-white">
      <div className="justify-center flex h-full items-center">
        <div className=""><a href='/'><img src={logo} alt="logo" /></a></div>
        <ul>
          {HeaderContent.map((element) => {
            return (
              <li
                key={element.path}
                className={currentPath === element.path ? 'header-menu selected' : 'header-menu'}
                onClick={() => HeaderMenuClickHandler(element.path)}>
                {element.label}
              </li>
            )
          })
          }
        </ul>
      </div>
    </nav>)
}

export default Header
