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
    <nav className="sticky top-0 w-full border-b bg-white z-[2]">
      <div className="justify-center flex h-full items-center">
        <div><a href='/'><img src={logo} alt="logo" className='w-[55%]' /></a></div>
        {HeaderContent.map((element) => {
          return (
            <div
              key={element.path}
              className={currentPath === element.path ? 'header-menu selected mr-[45px] text-3xl font-sans cursor-pointer text-[#4D24E2]' : 'header-menu text-3xl font-sans cursor-pointer mr-[45px]'}
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
