import styled from 'styled-components'
import defaultImg from '../images/room-1.jpeg'


//we can also pass props to styled component
const StyledHero = styled.header`
  min-height: 60vh;
  /* either use ternary operator here for default img or send alternate prop from singleRoom.js */
  background: url(${props => props.img?props.img:defaultImg}) center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default StyledHero;