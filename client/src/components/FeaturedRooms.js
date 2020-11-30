import React, { Component } from 'react'
import {RoomContext} from '../Context'
import Loading from './Loading'
import Room from './Room'
import Title from './Title'

export default class FeaturedRooms extends Component {
    static contextType = RoomContext;
    render() {
        // featuredRooms array from context.js is aliased as rooms
        let {loading, featuredRooms: rooms} = this.context;
        rooms = rooms.map(room => {
            return <Room key={room.id} room={room} />
        })
        return (
            <section className="featured-rooms">
                 <Title title="featured rooms"/>
                 <div className="featured-rooms-center">
                    {/* display rooms if data is not loading */}
                    {loading?<Loading/>:rooms}
                 </div>
            </section>
        )
    }
}

