import React from 'react';
import Header from '../components/Header'
import { HeaderContent } from '../router'


interface GeneralLayoutProps {
  children: React.ReactNode
}

const GeneralLayout: React.FC<GeneralLayoutProps> = ({ children }) => {

  return (
    <div className="general-layout">
      <Header HeaderContent={HeaderContent} />
      <div className="general-layout__body">
        {children}
      </div>
    </div>)
}

export default GeneralLayout
