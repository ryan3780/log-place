import md from '../assets/readme.jpg';

const About = () => {

  return (
    <div className='flex justify-center pt-[30px] flex-col items-center'>
      <span>아래의 이미지를 클릭하시면 프로젝트 github 새창이 열립니다.</span>
      <a href='https://github.com/ryan3780/log-place' target="_blank" rel="noopener noreferrer">
        <img src={md} alt="프로젝트 소개입니다" />
      </a>
    </div>
  )

}

export default About