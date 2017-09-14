import React, { Component } from 'react';
import Button from 'material-ui/RaisedButton';
import './Header.css';
import styled from 'styled-components';
import muiThemeable from 'material-ui/styles/muiThemeable';

const HeaderContainer = styled.div`
    width: 100%;
    height: 44px;
    background-color: ${({palette}) => palette.primary1Color};
`;

const LeftContainer = styled.div`
    float:left;
`;

const RightContainer = styled.div`
    float:right;
    padding:4px;
`;

const Title = styled.h1`
    margin: 1px;
    color: ${({palette}) => palette.alternateTextColor }
`

class Header extends Component {
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const { palette } = this.props.muiTheme;
    const MiddleContainer = styled.div`
        overflow: hidden;
    `;
    
    return (
        <HeaderContainer {...{palette}}>
            <LeftContainer>
                <Title {...{palette}}>metrics tracker</Title>
            </LeftContainer>
            <MiddleContainer />
            <RightContainer>
                {
                !isAuthenticated() && (
                    <Button
                        primary={true}
                        onClick={this.login.bind(this)}
                        label="Log In"
                    />
                    )
                }
                {
                isAuthenticated() && (
                    <Button
                        primary={true}
                        onClick={this.logout.bind(this)}
                        label="Log Out"
                    />
                    )
                }

            </RightContainer>
        </HeaderContainer>
    );
  }
}

export default muiThemeable()(Header);
