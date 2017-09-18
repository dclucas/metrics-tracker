import React, { Component } from 'react';
import Button from 'material-ui/Button';
import './Header.css';
import styled from 'styled-components';
import { withTheme } from 'material-ui/styles';

const HeaderContainer = styled.div`
    width: 100%;
    height: 44px;
    background-color: ${({palette}) => palette.primary[500]};
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
    color: ${({palette}) => palette.getContrastText(palette.primary[500]) }
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
    const { palette } = this.props.theme;
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
                        raised
                        color="primary"
                        onClick={this.login.bind(this)}
                    >
                    Log in
                    </Button>
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

export default withTheme(Header);
