import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';

type collectionType = {
  description: string;
  image: string;
  name: string;
  slug: string;
  id: string;
  ethprice?: number;
  usdprice?: number;
};

export default function Home() {
  const [searchParam, setSearchParam] = useState<string>('');
  const [results, setResults] = useState<collectionType[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<collectionType>();

  useEffect(() => {
    // When search param changes, then send a requets.

    async function search() {
      try {
        const r = await axios.get(`https://api.reservoir.tools/collections/v5?name=${searchParam}&limit=10`);

        setResults(r.data.collections);
      } catch (err) {
        alert('Error sending request!');
      }
    }

    if (searchParam.length > 2) {
      search();
    }
  }, [searchParam]);

  async function setSelColl(id: string) {
    if (results.length > 0) {
      const found = results.find((v, i) => v.id === id);
      if (found) {
        const r = await axios.get(`https://api.reservoir.tools/orders/asks/v3?ids=${id}&sortby=price&limit=10`);
        console.log(r);

        setSelectedCollection(found);
      } else {
        alert('Not found!');
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>OWND Preview</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">OWND!</a>
        </h1>

        <p className={styles.description}>Get started by editing searching for a collection</p>

        <div className={styles.innercontainer}>
          <div className={styles.search}>
            <input
              onChange={(e) => setSearchParam(e.target.value)}
              type="text"
              name="search"
              id="search"
              placeholder="Search for collection"
            />
          </div>

          <div className={styles.searchresults}>
            {results.length > 0 ? (
              results.map((v, i) => {
                return (
                  <div onClick={() => setSelColl(v.id)} key={i} className={styles.card}>
                    <div className={styles.imagecontainer}>
                      <Image src={v.image} fill alt={v.name} />
                    </div>
                    <p className={styles.cardtitle}>{v.name}</p>
                    <p className={styles.carddesc}>{v.description.slice(0, 30)}...</p>
                  </div>
                );
              })
            ) : (
              <p className={styles.nonefound}>No collections found!</p>
            )}
          </div>

          {selectedCollection && (
            <div className={styles.selectedCollection}>
              <div className={styles.selectedcollectioninner}>
                <p onClick={() => setSelectedCollection(undefined)} className={styles.closebutton}>
                  X
                </p>
                <p className={styles.selectedTitle}>{selectedCollection.name}</p>
                <p className={styles.selectedDescription}>{selectedCollection.description}</p>
                <div className={styles.selectedPrices}>
                  <p>10 ETH</p>
                  <p>100 USD</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a target={'_blank'} href="https://bechsolutions.dk">
          Powered by Bech Solutions
        </a>
      </footer>
    </div>
  );
}
