import { useEffect, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import usePokemonData from '../../hooks/usePokemonData'
import List from './List/List'
import './pokedex.scss'

const MAX_VISIBLE_ROWS = 5;
const FETCH_LIMIT = 30;
const PREFETCH_IDX = 10;
const POKEMON_ROW_HEIGHT = 80;

const Pokedex = ({ clearCache }) => {
  const {
    error,
    pokemonData,
    pokemonCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetching
  } = usePokemonData( FETCH_LIMIT );

  const parentRef = useRef()
  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    estimateSize: () => POKEMON_ROW_HEIGHT,
    count: hasNextPage ? pokemonCount + FETCH_LIMIT : pokemonCount,
    overscan: 3,
    enableSmoothScroll: true
  })

  useEffect( () => {
    const [ lastItem ] = [...rowVirtualizer.getVirtualItems()].reverse();

    if ( !lastItem ) return;

    const prefetchRowIdx = pokemonCount - PREFETCH_IDX;
    const fetchNextCondMet = !!( lastItem.index >= prefetchRowIdx );

    if (
      pokemonData
      && fetchNextCondMet
      && hasNextPage
      && !isLoading
      && !isFetching
    ) fetchNextPage();
  }, [
    hasNextPage,
    rowVirtualizer.getVirtualItems()
  ]);

  function wipeData() { // for testing
    clearCache();
  }

  const scrollList = (distance) => {
    parentRef.current?.scrollBy({ top: distance, behavior: 'smooth' });
  };

  const scrollByRows = (rows) => scrollList(rows * POKEMON_ROW_HEIGHT);
  const scrollByPage = (direction) => {
    const viewportHeight = parentRef.current?.clientHeight
      ?? POKEMON_ROW_HEIGHT * MAX_VISIBLE_ROWS;

    scrollList(direction * viewportHeight);
  };

  const returnToFirstPokemon = () => {
    parentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const topContouredLine = () => (
    <div className='svg-wrapper'>
      <svg fill="none">
        <path d='m 0 124 q 0 6 6 6 h 4 h 230 c 33 0 39 -64 73 -64 h 150 q 7 0 7 -6'/>
      </svg>
    </div>
  );

  const topLights = () => (
    <div className='lights'>
      <div
        className='lights--big'
        role='status'
        aria-label={ `Pokédex data status: ${error ? 'error' : isLoading ? 'loading' : 'ready'}` }>
        <span className='lamp-glass' aria-hidden='true'>
          <span className='lamp-highlight'/>
        </span>
      </div>
      <div className='lights--small' aria-hidden='true'>
        <div className='light'><span className='light-highlight'/></div>
        <div className='light'><span className='light-highlight'/></div>
        <div className='light'><span className='light-highlight'/></div>
      </div>
    </div>
  );

  const hardwareControls = () => (
    <div className='control-deck' aria-label='Pokédex hardware controls'>
      <div className='control-deck__seam' aria-hidden='true'/>
      <section className='action-cluster' aria-label='Action controls'>
        <button
          className='primary-action'
          type='button'
          aria-label='Return to the first Pokémon'
          onClick={ returnToFirstPokemon }>
          <span aria-hidden='true'/>
        </button>
        <div className='secondary-actions'>
          <button type='button' aria-label='Scroll up one page' onClick={ () => scrollByPage(-1) }/>
          <button type='button' aria-label='Scroll down one page' onClick={ () => scrollByPage(1) }/>
        </div>
        <div className='indicator-bars' aria-hidden='true'>
          <span/><span/>
        </div>
      </section>

      <div className='utility-panel'>
        <div className='speaker-grille' aria-hidden='true'>
          { Array.from({ length: 6 }, (_, index) => <span key={ index }/>) }
        </div>
        <div className='status-panel' role='status' aria-label={ `${pokemonCount || 0} Pokémon loaded` }>
          <span className='status-panel__led' aria-hidden='true'/>
          <strong>{ String(pokemonCount || 0).padStart(3, '0') }</strong>
          <small>DATA</small>
        </div>
      </div>

      <div className='dpad' aria-label='List navigation controls'>
        <button className='dpad__up' type='button' aria-label='Scroll up one Pokémon' onClick={ () => scrollByRows(-1) }/>
        <button className='dpad__left' type='button' aria-label='Scroll up one page' onClick={ () => scrollByPage(-1) }/>
        <span className='dpad__center' aria-hidden='true'/>
        <button className='dpad__right' type='button' aria-label='Scroll down one page' onClick={ () => scrollByPage(1) }/>
        <button className='dpad__down' type='button' aria-label='Scroll down one Pokémon' onClick={ () => scrollByRows(1) }/>
      </div>
    </div>
  );

  const listViewport = () => (
    <div
      ref={ parentRef }
      className='pd-list-container'
      style={{
        height: `${ POKEMON_ROW_HEIGHT * MAX_VISIBLE_ROWS }px`
      }}
    >
      <List
        pokeData={ pokemonData }
        pokeCount={ pokemonCount }
        listItems={ rowVirtualizer.getVirtualItems() }
        listHeight={ `${rowVirtualizer.getTotalSize()}px` }
        hasNextPage={ !!hasNextPage }/>
    </div>
  );

  return (
    <div className='pokedex'>
      <div className='pd-body--top'>
        { topContouredLine() }
        { topLights() }
      </div>
      <div className='pd-body--center'>
        <div className='pd-screen'> {
          isLoading
            ? <p>Loading...</p>
            : error
              ? <span>Error: {error}</span>
              : ( pokemonData && pokemonCount && listViewport())
        } </div>
      </div>
      <div className='pd-body--bottom'>
        { hardwareControls() }
      </div>
    </div>
  );
};

export default Pokedex;
