A job application for Quorum. You can run it with 

npm install
<br />
npm run dev

The files 'bills.csv' and 'legislators-support-oppose-count.csv' in the root folder are the outputs obtained.


1. Discuss your solution’s time complexity. What tradeoffs did you make?

    Since the data is loaded from a CSV everything
    is commited to memory, which makes the data manipulation very fast but is not an option if the data files start to get much bigger. Since no operation is larger than O(n) no further optimizations were made.

2. How would you change your solution to account for future columns that might be
requested, such as “Bill Voted On Date” or “Co-Sponsors”?

    The data is neatly defined in interfaces, so the first step is to modify those to include new columns. 
    
    Since each information has a method responsible for getting it, it is easy to add new methods for any data regarding these new columns. Depending on the number of methods it would wise to put them in separated files. 

3. How would you change your solution if instead of receiving CSVs of data, you were given a
list of legislators or bills that you should generate a CSV for?

    The code was constructed by abstracting the data received in the useRetrieveData hook. It is trivial to change how the data is fetched and everything should work the same as long as you return the same data. 


4. How long did you spend working on the assignment?

    I had a problem setting papaparse (the library for reading and writing csv files) up and learning how to use it, which took around an hour. 
    A prototype was made and refined in about two hours and a more refined version was made with one more hour.
