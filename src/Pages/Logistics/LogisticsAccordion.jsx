import React from 'react';
import { useSWR } from 'swr';
import { Accordion, AccordionTab } from 'primereact/accordion';
import AWS from 'aws-sdk';
import DOMPurify from 'dompurify';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const fetchData = async () => {
  const result = await dynamoDB.scan({
    TableName: 'your-table-name',
  }).promise();

  return result.Items;
};

const DynamoDBAccordion = () => {
  const { data, error } = useSWR('dynamodb-items', fetchData, {
    revalidateOnFocus: false,
  });

  if (error) return <div>Failed to load data</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <Accordion multiple={true}>
      {data.map(item => (
        <AccordionTab header={item.title}>
          <ul>
            {item.instruction.map((inst, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(inst) }} />
            ))}
          </ul>
        </AccordionTab>
      ))}
    </Accordion>
  );
};

export default DynamoDBAccordion;
