export const TryItOutButton = ({ link, label }): JSX.Element => {
  const css = `b {
    position: relative;
    display: block;
    font-family: helvetica neue, helvetica, sans-serif;
    line-height: 1.15em;
    margin-top: -1.15em;
    top: 2.3em;
    font-size: 0.67em;
    font-weight: 400;
    letter-spacing: 0.025em;
    opacity: 0.75;
    text-align: center;
  }
  
  b span {
    font-size: 0.785em;
    font-weight: 400;
    opacity: 0.4;
  }
  
  #intro {
    width: 200px;
  }
  
  .button {
    display: inline-block;
    text-decoration: none;
    position: relative;
    transform: rotate(-2deg);
  }
  
  .button .bottom {
    position: absolute;
    left: 7px;
    top: 7px;
    width: 100%;
    height: 100%;
    background-color: rgba(0,212,255,1);
    display: block;
    -webkit-transition: all .15s ease-out;
    -moz-transition: all .15s ease-out;
    -o-transition: all .15s ease-out;
    transition: all .15s ease-out;
  }
  
  .button .top {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 24px 34px 22px 34px;
    border: 2px solid rgba(92,92,153,1);
  }
  
  .button-dark .top {
    border: 2px solid #fff;
  }
  
  .button .top .label {
    font-family: sans-serif;
    font-weight: 600;
    color: rgba(92,92,153,1);
    font-size: 12px;
    line-height: 110%;
    letter-spacing: 2px;
    text-align: center;
    text-transform: uppercase;
    -webkit-transition: all .15s ease-out;
    -moz-transition: all .15s ease-out;
    -o-transition: all .15s ease-out;
    transition: all .15s ease-out;
  }
  
  .button-dark .top .label {
    color: #fff;
  }
  
  .button:hover .bottom {
    left: 0;
    top: 0;
    background-color: #f3f3f3;
  }
  
  .button:hover .top .label {
    color: rgba(0,212,255,1);
  }
  `

  return (
    <div>
      <style>
        {css}
      </style>
      <section id='intro'>
        <a href={link} className='button nav-link'>
          <div className='bottom' />
          <div className='top'>
            <div className='label'>{label}</div>
            <div className='button-border-left' />
            <div className='button-border-top' />
            <div className='button-border-right' />
            <div className='button-border-bottom' />
          </div>
        </a>
      </section>
    </div>
  )
}

export const TryItOutButton2 = ({ label }): JSX.Element => {
  const css = `.button-53 {
    background-color: #3DD1E7;
    border: 0 solid #E5E7EB;
    box-sizing: border-box;
    color: #000000;
    display: flex;
    font-family: ui-sans-serif,system-ui,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-size: 1rem;
    font-weight: 700;
    justify-content: center;
    line-height: 1.75rem;
    padding: .75rem 1.65rem;
    position: relative;
    text-align: center;
    text-decoration: none #000000 solid;
    text-decoration-thickness: auto;
    width: 100%;
    max-width: 460px;
    position: relative;
    cursor: pointer;
    transform: rotate(-2deg);
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }
  
  .button-53:focus {
    outline: 0;
  }
  
  .button-53:after {
    content: '';
    position: absolute;
    border: 1px solid #000000;
    bottom: 4px;
    left: 4px;
    width: calc(100% - 1px);
    height: calc(100% - 1px);
  }
  
  .button-53:hover:after {
    bottom: 2px;
    left: 2px;
  }
  
  @media (min-width: 768px) {
    .button-53 {
      padding: .75rem 3rem;
      font-size: 1.25rem;
    }
  }`
  return (
    <div>
      <style>
        {css}
      </style>
      <button className='button-53' role='button'>{label}</button>
    </div>
  )
}
