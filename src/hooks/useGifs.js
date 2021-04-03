import { useContext, useState, useEffect } from 'react';
import getGifs from '../services/getGifs';
import GifsContext from '../context/GifsContext'

const INITIAL_PAGE = 0

export function useGifs({ keyword } = { keyword: 'argentina' }) {

    const [loading, setLoading] = useState(false);
    const [loadingNextPage, setLoadingNextPage] = useState(false);
    
    const [page, setPage] = useState(INITIAL_PAGE)
    const { gifs, setGifs } = useContext(GifsContext);

    //recuperamos la keyword del local storage
    const keywordToUse = keyword || localStorage.getItem('lastKeyword') || 'random'

    useEffect(function () {
        setLoading(true)

        getGifs({ keyword: keywordToUse })
            .then(gifs => {
                setGifs(gifs)
                setLoading(false)
                //guardamos la keyword en el localstorage
                localStorage.setItem('lastKeyword', keyword)
            })
    }, [keyword, keywordToUse, setGifs])

    useEffect(function () {
        if (page === INITIAL_PAGE) return
        setLoadingNextPage(true)
        getGifs({ keyword : keywordToUse, page })
            .then(nextGifs => {
                setGifs(prevGifs => prevGifs.concat(nextGifs))
                setLoadingNextPage(false)
            })
    }, [keywordToUse, page, setGifs])

    return { loading, loadingNextPage, gifs, setPage }
}