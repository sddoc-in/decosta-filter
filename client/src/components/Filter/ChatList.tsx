import React from 'react';
import Searchbar from '../input/Searchbar';

export default function ChatList({setSearchTerm}:any
) {

    return (
        <div className='chat-list primary-light-bg p-3 me-2'>
            <div className='d-flex align-items-center justify-content-between'>
                <Searchbar setSearchTerm={setSearchTerm} />
                </div>
                </div>
    )
}
