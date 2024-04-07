import { chatStore } from '(@/store/chatStore)';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

const ChatSearch = ({ isScrollTop }: { isScrollTop: boolean }) => {
  const { searchMode, messages, setSearchMode } = chatStore((state) => state);
  const [searchWord, setSearchWord] = useState('');
  const [doneSearchDivs, setDoneSearchdivs] = useState<(HTMLElement | null)[]>();
  const [searchCount, setSearchCount] = useState(0);
  const [upDownCount, setUpDownCount] = useState(0);

  const handleSearch = () => {
    const filteredIds = messages
      .filter((m) => m.message.includes(searchWord))
      .map((messages) => messages.message_id)
      .reverse();

    const idsDivs = filteredIds.map((id) => {
      return document.getElementById(`${messages.find((m) => m.message_id === id)?.message_id}`);
    });
    setDoneSearchdivs(idsDivs);

    if (idsDivs && idsDivs.length >= searchCount + 1) {
      const theDiv = idsDivs[searchCount];
      if (theDiv) {
        theDiv.style.backgroundColor! = 'gray';
        theDiv.scrollIntoView({ block: 'center' });
        setSearchCount((prev) => prev + 1);
        setUpDownCount((prev) => prev + 1);
        // upDownCount는 지금까지 search한 것을 기반으로 되어야 하니까 여기에 종속되어서 +
      }
    } else {
      alert('더 이상 찾을 내용이 없습니다.');
    }
  };

  const handleSearchUp = () => {
    console.log(doneSearchDivs);
    if (doneSearchDivs) {
      const theDiv = doneSearchDivs[upDownCount];
      console.log(theDiv);
      if (theDiv) {
        theDiv.style.backgroundColor! = 'gray';
        theDiv.scrollIntoView({ block: 'center' });
      }
      setUpDownCount((prev) => prev + 1);
    }
  };
  const handleSearchDown = () => {
    console.log(doneSearchDivs);
    if (doneSearchDivs) {
      const theDiv = doneSearchDivs[upDownCount - 2];
      console.log(theDiv);
      if (theDiv) {
        theDiv.style.backgroundColor! = 'gray';
        theDiv.scrollIntoView({ block: 'center' });
      }
      setUpDownCount((prev) => prev - 1);
    }
  };

  const clearColor = () => {
    doneSearchDivs?.forEach((div) => {
      if (div) div.style.backgroundColor = 'transparent';
    });
  };

  const stopSearch = () => {
    setSearchMode();
    setSearchCount(0);
    setSearchWord('');
    clearColor();
    setDoneSearchdivs([]);
    setUpDownCount(0);
  };

  return (
    <>
      {searchMode ? (
        <div className={`${isScrollTop ? '' : 'absolute'} flex justify-between w-full bg-gray-500`}>
          <div className="flex gap-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex gap-2"
            >
              <input value={searchWord} onChange={(e) => setSearchWord(e.target.value)} autoFocus></input>
              <button>검색</button>
            </form>
            <div>{doneSearchDivs?.length ? `(${doneSearchDivs?.length})` : ''}</div>
          </div>

          <div className="flex gap-2">
            <div>
              <button onClick={handleSearchUp}>
                <FaChevronUp />
              </button>
              <button onClick={handleSearchDown}>
                <FaChevronDown />
              </button>
            </div>
            <button onClick={stopSearch}>
              <FaX />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ChatSearch;
