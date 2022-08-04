const AWS = require("aws-sdk");
var rdsdataservice = new AWS.RDSDataService({ apiVersion: "2018-08-01" });
AWS.config.update({ region: "*" });

const { v4: uuidv4 } = require("uuid");
let globalTransactionId;

let response;

exports.createSongHandler = async (event, context) => {
  try {
    let body = event.body;

    let beginTransaction = await rdsdataservice
      .beginTransaction({
        resourceArn: process.env.DATABASE_RESOURCE_ARN /* required */,
        secretArn: process.env.DATABASE_SECRET_ARN /* required */,
        database: process.env.DATABASE_NAME,
      })
      .promise();

    globalTransactionId = beginTransaction.transactionId;

    await Promise.all(
      event.body.musicalworkname.map((record) => {
        return CreateSong(record, event.body);
      })
    );

    let commit = await rdsdataservice
      .commitTransaction({
        transactionId: globalTransactionId,
        resourceArn: process.env.DATABASE_RESOURCE_ARN /* required */,
        secretArn: process.env.DATABASE_SECRET_ARN /* required */,
      })
      .promise();

    return (response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "song created",
      }),
    });
  } catch (err) {
    await rdsdataservice.rollbackTransaction({
      resourceArn: process.env.DATABASE_RESOURCE_ARN,
      secretArn: process.env.DATABASE_SECRET_ARN,
      transactionId: globalTransactionId,
    });
    return err;
  }
};

async function CreateSong(songName, eventBody) {
  let song = {
    musicalworkid: uuidv4(),
    musicalworkname: songName,
    artistid: eventBody.artistid,
    musicalassetid: eventBody.musicalassetid,
    musicalwork_release_year: eventBody.musicalwork_release_year,
    mainartist: eventBody.mainartist
  };

  console.log(songName, eventBody);

  var executeCreateSongs = await rdsdataservice
    .executeStatement({
      transactionId: globalTransactionId,
      resourceArn: process.env.DATABASE_RESOURCE_ARN /* required */,
      secretArn: process.env.DATABASE_SECRET_ARN /* required */,
      sql: `

INSERT INTO musicalworks(id, musicalassets, name, release_year)
VALUES
(CAST(:musicalworkid as UUID), CAST(:musicalassetid as UUID), (:musicalworkname) , (:musicalwork_release_year));

INSERT INTO musicalworks_artists(musicalworks, artists, main)
VALUES
(CAST(:musicalworkid as UUID), CAST(:artistid as UUID), (:mainartist));


INSERT INTO musicalassets_musicalworks(musicalassets, musicalworks)
VALUES
(CAST(:musicalassetid as UUID), CAST(:musicalworkid as UUID));

  `,
      continueAfterTimeout: true,
      database: process.env.DATABASE_NAME,
      includeResultMetadata: true,
      parameters: [
        {
          name: "artistid",
          value: {
            stringValue: song.artistid,
          },
        },
        {
          name: "musicalassetid",
          value: {
            stringValue: song.musicalassetid,
          },
        },
        {
          name: "musicalwork_release_year",
          value: {
            longValue: song.musicalwork_release_year,
          },
        },
        {
          name: "musicalworkid",
          value: {
            stringValue: song.musicalworkid,
          },
        },
        {
          name: "musicalworkname",
          value: {
            stringValue: song.musicalworkname,
          },
        },
        {
          name: "mainartist",
          value: {
            booleanValue: song.mainartist,
          },
        },
      ],
    })
    .promise();
}
