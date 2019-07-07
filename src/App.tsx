import React, { Fragment, useEffect, useState } from 'react';
import './App.css';
import { IList } from './List';
import { AutoSizer, List } from 'react-virtualized';

type element = React.FormEvent<HTMLFormElement>;

function App(): JSX.Element {
  // set the initial state
  const [value, setValue] = useState<string>('');
  // @ts-ignore
  const [items, updateList] = useState<Array<IList>>(
    () => JSON.parse(window.localStorage.getItem('list')) || []
  );

  // use effect to sync with local storage so that it will reload the list of refresh
  useEffect(() => {
    window.localStorage.setItem('list', JSON.stringify(items));
  }, [items]);

  // handle submission
  const handleSubmit = (e: element): void => {
    e.preventDefault();
    createList(value);
    setValue('');
  };

  // create the list
  const createList = (numberOfItems: string): void => {
    let listOfItems: Array<IList> = [];
    const length = items && items.length;
    for (let i: number = length; i < parseInt(numberOfItems, 0) + length; i++) {
      listOfItems.unshift({ content: 'item n-' + i.toString(), idx: i });
    }
    // const listOfItems: Array<IList> = Array(parseInt(numberOfItems, 0))
    //     .fill(0)
    //     .map((val, i) => {return {content: 'item n-' +  (i+length).toString(), idx: i + length}});
    const list: Array<IList> = [...items, ...listOfItems];
    updateList(list);
  };

  // reset the list
  const resetList = (): void => {
    updateList([]);
  };

  // delete the item from the list
  const deleteItem = (index: number): void => {
    const updatedArrayAfterDeleteItem = items.filter((item: IList) => item.idx !== index);
    updateList(updatedArrayAfterDeleteItem);
  };

  const calculateHeight = (): number => {
    return window.innerHeight - 50;
  };
  const calculateWidth = (): number => {
    return window.innerWidth - 50;
  };

  // @ts-ignore
  function rowRenderer({ key, index, isScrolling, isVisible, style }) {
    return (
      <div key={index} style={style} className={'itemsList'}>
        {items[index].content}
        <button style={{ float: 'right' }} onClick={() => deleteItem(items[index].idx)}>
          Delete
        </button>
      </div>
    );
  }

  return (
    <Fragment>
      <h1>Virtual List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={'# of items'}
          value={value}
          onChange={e => setValue(e.target.value.replace(/\D/, ''))}
          required
        />
        <button type="submit">Generate</button>
        <button type="reset" onClick={() => resetList()}>
          Reset
        </button>
      </form>
      <section>
        <AutoSizer>
          {({ width, height }): any => {
            return (
              <List
                rowCount={items.length}
                width={calculateWidth()}
                height={calculateHeight()}
                rowHeight={50}
                scrollToIndex={items.length} // starts the scroll position from bottom
                rowRenderer={rowRenderer}
              />
            );
          }}
        </AutoSizer>
      </section>
    </Fragment>
  );
}
export default App;
