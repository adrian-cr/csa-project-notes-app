import styled from "styled-components"
import {Link} from "react-router-dom"

export default function Header() {
  return (
    <HeaderContainer className="header">
      <Link className="header-link" to="/">
        <img className="header-logo" src="/images/logo.png"/>
      </Link>
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  align-items: center;
  background-color: #fff;
  display: flex;
  height: 15vh;
  justify-content: center;
  .header-link {
    height: min-content;
    width: calc(150px + 5%)
  }
  .header-logo {
    width: 100%;
  }
`;
