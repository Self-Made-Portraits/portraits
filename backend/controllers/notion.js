const { Client } = require('@notionhq/client');
const Notion = require('../models/notion');
const NotionCache = require('../models/notionCache');


// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_API_TOKEN});
const databaseId = "96c744f004594a2fa89a332bfabd95ba"; 

const getNotionData = async (req, res) => {
  // const { date, title } = req.params;
  //Check if the data from Notion is already in the Cache
  try {
    const cacheKey = 'notionData';
    const cachedData = await NotionCache.findOne({ key: cacheKey });

    const sortPagesByDate = (pages) => {
      return pages.sort((a, b) => {
        const dateA = new Date(a.properties.Date.date.start);
        const dateB = new Date(b.properties.Date.date.start);
        return dateB - dateA; // Sorting from oldest to newest
      });
    };

      // Step 1: Fetch the database pages
      const response = await notion.databases.query({ 
          database_id: databaseId,
        });
      const pages = response.results;

      const filteredPages = pages.filter(page => page?.properties?.Status?.status?.name === 'Done');

          // Sort pages by date
      const sortedPages = sortPagesByDate(filteredPages);
      // Step 2: Fetch content for each page
      const pagesWithContent = await Promise.all(sortedPages.map(async (page) => {
          const pageContentResponse = await notion.blocks.children.list({
              block_id: page.id,
          });
      // Extracting images and lists from the content
      const contentWithDetails = await Promise.all(pageContentResponse.results.map(async (block) => {
        if (block.type === 'image') {
            block.imageUrl = block.image.file.url;
        } else if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
          block.listItem = block[block.type]
        } 
        
        else if (block.type === 'to_do') {
          block.toDo = {
            text: (block.to_do.rich_text || []).map(text => text.plain_text).join(' '),
            checked: block.to_do.checked,
          };
        } else if (block.type === 'equation') {
          block.equationContent = block.equation.expression;
        } else if (block.type === 'quote' || block.type === 'callout') {
          block.textContent = (block[block.type]?.rich_text || []).map(text => text.plain_text).join(' ');
        } else if (block.type === 'column') {
          const columnContentResponse = await notion.blocks.children.list({
            block_id: block.id,
          });
          block.columnContent = columnContentResponse.results;
        } else if (block.type === 'column_list') {
          const columnListContentResponse = await notion.blocks.children.list({
            block_id: block.id,
          });
          block.columnListContent = columnListContentResponse.results.map(async (column) => {
            const columnContentResponse = await notion.blocks.children.list({
              block_id: column.id,
            });
            return columnContentResponse.results;
          });
        } else if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
            block.listItem = (block[block.type]?.rich_text || []).map(text => text.plain_text).join(' ');
        } else if (block.type === 'table') {
          const tableContentResponse = await notion.blocks.children.list({
            block_id: block.id,
          });
          // console.log('Table content response:', tableContentResponse);
          block.tableContent = tableContentResponse.results.map(row => ({
            cells: (row.table_row?.cells || []).map(cell => {
            // console.log('Cell content:', cell);
              return cell[0] || '';
              // cell.map(content => content.plain_text).join(' ')
              // return (cell.rich_text || []).map(text => text[0].plain_text).join(' ');
            }),
          }));
        } else if (block.type === 'code') {
          // console.log('Cell content:', block.code.rich_text);
          block.codeContent = block.code.rich_text.map(text => text.text.content).join('\n');
        }
        return block;
      }));

      return {
        ...page,
        content: contentWithDetails,
      };
    }));
    

    if (cachedData) {
      const cachedPagesWithContent = cachedData.data;

      // Compare cached data with fetched data
      const hasChanges = JSON.stringify(cachedPagesWithContent) !== JSON.stringify(pagesWithContent);

      if (!hasChanges) {
        console.log('Data retrieved from cache');
        return res.json(cachedPagesWithContent);
      } else {
        console.log('Changes detected, updating database and cache');
      }
    }
    // Save the data in Notion database, if it is new or has changes
    await Promise.all(pagesWithContent.map(async (page) => {
      await Notion.updateOne(
        { 'id': page.id }, // Use a unique identifier from the Notion data
        { $set: page },
        { upsert: true }
      );
    }));

    console.log('Data saved to MongoDB successfully.')
    // await Notion.insertMany(pagesWithContent);
    // Update the cache
    await NotionCache.updateOne(
        { key: cacheKey },
        { data: pagesWithContent, createdAt: new Date() },
        { upsert: true }
      );
      
    return pagesWithContent
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

    // Helper function to transform date format
const transformDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      return `${day}.${month}.${year}`;
  };

const getNotionDataFromDB = async (req, res) => {
    const { date, title } = req.body;
  
    // Pre-process the date and title
    const processedDate = date.replace(/\s+/g, '-').toLowerCase()
    const processedTitle = title.replace(/\s+/g, '-').toLowerCase()
    try {
      // Check if the data is in the cache
      const cachedData = await NotionCache.findOne();
  
      if (cachedData) {
        // Filter the exact article from the cached data
        const filteredCachedData = cachedData.data.filter(article => {
          const articleDate =  transformDate(article.properties.Date.date.start).replace(/[\s.]+/g, '-').toLowerCase();
          const articleTitle = article.properties.Name.title[0].plain_text.replace(/[\s.]+/g, '-').toLowerCase();
          return articleDate === processedDate && articleTitle === processedTitle;
        });

        
        if (filteredCachedData.length > 0) {
          const articles = {
              name: filteredCachedData[0]?.properties?.Name?.title?.[0]?.plain_text || 'No title',
              year: transformDate(filteredCachedData[0]?.properties.Date.date.start) || 'No date',
              image: filteredCachedData[0]?.properties?.Attachments?.files?.[0]?.file?.url || 'No image',
              brief: filteredCachedData[0]?.properties?.Brief?.rich_text?.[0]?.plain_text || 'No brief', 
              type: filteredCachedData[0]?.properties?.type?.rich_text[0].plain_text || 'No type',
              description: filteredCachedData[0]?.content || 'No description' 
            }
          console.log('Data retrieved from cache');
          return res.json(articles);
          // return res.json(filteredCachedData);
        }
      }
  
      // If not found in cache, check the original database
      const notionData = await Notion.find();
  
      // Filter the exact article from the database
      const filteredData = notionData.filter(article => {
        const articleDate =  transformDate(article.properties.Date.date.start.replace(/[\s.]+/g, '-').toLowerCase());
        const articleTitle = article.properties.Name.title[0].plain_text.replace(/\s+/g, '-').toLowerCase();
        return articleDate === processedDate && articleTitle === processedTitle;
      });
  
      if (filteredData.length > 0) {
        // Cache the data for future requests
        await NotionCache.updateOne(
          { key: 'notionData' },
          { data: notionData, createdAt: new Date() },
          { upsert: true }
        );
        
        const articles = {
          name: filteredData[0]?.properties?.Name?.title?.[0]?.plain_text || 'No title',
          year: transformDate(filteredData[0]?.properties.Date.date.start) || 'No date',
          image: filteredData[0]?.properties?.Attachments?.files?.[0]?.file?.url || 'No image',
          brief: filteredData[0]?.properties?.Brief?.rich_text?.[0]?.plain_text || 'No Brief', 
          type: filteredData[0]?.properties?.type?.rich_text[0].plain_text || 'No type',
          description: filteredData[0]?.content || 'No Description' 
        }
        console.log('Data retrieved from cache');
        return res.json(articles);
      } else {
        res.json({ message: 'Article not found in backend' });
      }
    } catch (error) {
      console.error('Error fetching data from MongoDB:', error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  

  const cleanUpOldData = async () => {
    try {
      const response = await notion.databases.query({ database_id: databaseId });
      const pages = response.results.map(page => page.id);
  
      // Delete documents in MongoDB that are not present in Notion anymore
      await Notion.deleteMany({ 'properties.id': { $nin: pages } });
  
      console.log('Old data cleaned up successfully.');
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  };
  

const getNotionInfoFromDB = async (req, res) => {
  try {
    const cacheKey = 'notionData';
    const cachedData = await NotionCache.findOne({});

    if (cachedData) {
      console.log('Data retrieved from cache');
      const articles = (cachedData.data.map(result => {
        return {
          name: result?.properties?.Name?.title?.[0]?.plain_text || 'No title',
          year: transformDate(result?.properties?.Date?.date?.start) || 'No date',
          image: result?.properties?.Attachments?.files?.[0]?.file?.url || 'No image',
          brief: result?.properties?.Brief?.rich_text?.[0]?.plain_text || 'No Brief', 
          type: result?.properties?.type?.rich_text[0].plain_text || 'No type'
        }
      }))
      return res.json(articles);
    }

    const notionData = await Notion.find();
    const articles = notionData.map(result => {
      return {
        name: result?.properties?.Name?.title?.[0]?.plain_text || 'No title',
        year: transformDate(result?.properties?.Date?.date?.start) || 'No date',
        brief: result?.properties?.Description?.rich_text?.[0]?.plain_text || 'No description',
        image: result?.properties?.Attachments?.files?.[0]?.file?.url || 'No image',
        description: result?.properties?.Description?.rich_text?.[0]?.plain_text || 'No description', 
        type: result?.properties?.type?.rich_text[0].plain_text || 'No type'
      };
    });

    // Cache the data for future requests`
    await NotionCache.updateOne(
      { key: cacheKey },
      { data: articles, createdAt: new Date() },
      { upsert: true }
    );

    res.json(articles);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = {
   getNotionDataFromDB, getNotionInfoFromDB, getNotionData,
};

// Run the clean-up function periodically or on application start
cleanUpOldData();
setInterval(cleanUpOldData, 24 * 60 * 60 * 1000); // Run once a day

