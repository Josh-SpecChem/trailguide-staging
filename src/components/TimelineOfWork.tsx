// /components/TimelineOfWork.tsx
import React from 'react';

export function TimelineOfWork() {
  const timeline = [
    {
      year: '2003',
      title: 'The Shaping of Things to Come',
      coAuthors: ['Michael Frost'],
      link: 'https://www.amazon.com/dp/080101280X',
      image: '/images/tsottc.jpg',
    },
    {
      year: '2006',
      title: 'The Forgotten Ways: Reactivating the Missional Church',
      link: 'https://www.amazon.com/dp/1587431645',
      image: '/images/tfw.jpg',
    },
    {
      year: '2009',
      title: 'ReJesus: A Wild Messiah for a Missional Church',
      coAuthors: ['Michael Frost'],
      link: 'https://www.amazon.com/dp/1598562289',
      image: '/images/rejesus.jpg',
    },
    {
      year: '2009',
      title: 'The Forgotten Ways Handbook',
      coAuthors: ['Darryn Altclass'],
      link: 'https://www.amazon.com/dp/1587432498',
      image: '/images/tfwh.jpg',
    },
    {
      year: '2010',
      title: 'Untamed: Reactivating a Missional Form of Discipleship',
      coAuthors: ['Debra Hirsch'],
      link: 'https://www.amazon.com/dp/0801013423',
      image: '/images/untamed.jpg',
    },
    {
      year: '2010',
      title: 'Right Here, Right Now: Everyday Mission for Everyday People',
      coAuthors: ['Lance Ford'],
      link: 'https://www.amazon.com/dp/0801072237',
      image: '/images/placeholder.jpg',
    },
    {
      year: '2011',
      title: 'On the Verge: A Journey Into the Apostolic Future of the Church',
      coAuthors: ['Dave Ferguson'],
      link: 'https://www.amazon.com/dp/031032525X',
      image: '/images/otv.jpg',
    },
    {
      year: '2011',
      title: 'The Faith of Leap: Embracing a Theology of Risk, Adventure & Courage',
      coAuthors: ['Michael Frost'],
      link: 'https://www.amazon.com/dp/080101442X',
      image: '/images/placeholder.jpg',
    },
    {
      year: '2012',
      title: 'The Permanent Revolution: Apostolic Imagination and Practice for the 21st Century Church',
      coAuthors: ['Tim Catchim'],
      link: 'https://www.amazon.com/dp/1118173584',
      image: '/images/tpr.jpg',
    },
    {
      year: '2014',
      title: 'Fast Forward to Mission: Frameworks for a Life of Impact',
      link: 'https://www.amazon.com/dp/B00LZ7FZ5E',
      image: '/images/placeholder.jpg',
    },
    {
      year: '2017',
      title: '5Q: Reactivating the Original Intelligence and Capacity of the Body of Christ',
      link: 'https://www.amazon.com/dp/0998639307',
      image: '/images/5q.jpg',
    },
    {
      year: '2018',
      title: 'Activating 5Q: A User’s Guide',
      coAuthors: ['Jessie Cruickshank'],
      link: 'https://www.amazon.com/dp/0998639315',
      image: '/images/5q.jpg',
    },
    {
      year: '2019',
      title: 'Reframation: Seeing God, People, and Mission Through Reenchanted Frames',
      coAuthors: ['Mark Nelson'],
      link: 'https://www.amazon.com/dp/0998639323',
      image: '/images/reframation.jpg',
    },
    {
      year: '2020',
      title: 'The Starfish and the Spirit: Unleashing the Leadership Potential of Churches and Organizations',
      coAuthors: ['Lance Ford', 'Rob Wegner'],
      link: 'https://www.amazon.com/dp/0310102094',
      image: '/images/placeholder.jpg',
    },
    {
      year: '2021',
      title: 'Metanoia: How God Radically Transforms People, Churches, and Organizations From the Inside Out',
      coAuthors: ['Rob Kelly'],
      link: 'https://www.amazon.com/dp/0998639331',
      image: '/images/metanoia.jpg',
    },
    {
      year: '2022',
      title: 'Disciplism: Reimagining Evangelism Through the Lens of Discipleship',
      link: 'https://exponential.org/product/disciplism/',
      image: '/images/disciplism.jpg',
    },
  ];

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-black sm:text-4xl xl:text-5xl font-pj">
            Timeline of Work
          </h2>
          <p className="max-w-lg mx-auto mt-6 text-lg font-normal text-gray-600 dark:text-gray-300 font-pj">
            A chronological journey through Alan Hirsch's contributions to missional thought and practice.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-12 sm:px-10">
          {timeline.map((entry, index) => (
            <div
              key={index}
              className="relative pb-10 group transition-transform transform hover:scale-105"
            >
              {index !== timeline.length - 1 && (
                <span
                  className="absolute w-px h-full -ml-px bg-gray-200 dark:bg-gray-700 top-8 left-12"
                  aria-hidden="true"
                ></span>
              )}

              <div className="relative p-6 overflow-hidden bg-white dark:bg-whiteOlive border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md group-hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  {/* Left: Year and content */}
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-tekhelet text-black text-xl font-bold shadow-lg">
                      {entry.year}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-semibold text-black dark:text-text">
                        {entry.title}
                      </h3>
                      {entry.coAuthors && (
                        <p className="text-sm text-text-muted dark:text-text-muted">
                          Co-authored with {entry.coAuthors.join(', ')}
                        </p>
                      )}
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block px-4 py-2 bg-amaranthPurple text-black text-sm font-medium rounded hover:bg-opacity-90 transition"
                      >
                        View Book
                      </a>
                    </div>
                  </div>

                  {/* Right: Thumbnail */}
                  <div className="mt-4 sm:mt-0 sm:ml-6">
                    <img
                      src={entry.image || '/images/placeholder.jpg'}
                      alt={`${entry.title} cover`}
                      className="w-24 h-24 object-cover rounded-md shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}