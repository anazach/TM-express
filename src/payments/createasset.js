const AWS = require("aws-sdk");
var rdsdataservice = new AWS.RDSDataService({ apiVersion: "2018-08-01" });
AWS.config.update({ region: "*" });

const { v4: uuidv4 } = require("uuid");

let response;

exports.createAssetHandler = async (event, context) => {
  try {
    let body = event.body;
    let song = {
      artistid: uuidv4(),
      labelid: uuidv4(),
      publisherid: uuidv4(),
      musicalassetid: uuidv4(),
      musicalworkid: uuidv4(),
      investmentid: uuidv4(),
      songwriterid: uuidv4(),
      contractid: uuidv4(),
      musicproducerid: uuidv4(),
      sellorderid: uuidv4(),
      musicalassetid: body.musicalassetid,
      numberofshares: body.numberofshares,
      shareprice: body.shareprice,
      artist: body.artist,
      assetname: body.assetname,
      assettype: body.assettype,
      releaseyear: body.releaseyear,
      amount: body.amount,
      marketpercentage: body.marketpercentage,
      revenue: body.revenue,
      revenuesource: body.revenuesource,
      floatdate: body.floatdate,
      maturitydate: body.maturitydate,
      payoutdate: body.payoutdate,
      musicalworkname: body.musicalworkname,
      musicalwork_release_year: body.musicalwork_release_year,
      copyrightownername: body.copyrightownername,
      copyrightownerid: body.copyrightownerid === "" ? uuidv4() : body.copyrightownerid,
      copyrightownercognitoid: body.copyrightownercognitoid,
      sellusercognitoid: body.sellusercognitoid === "" ? body.copyrightownercognitoid : body.sellusercognitoid,
    };

    let beginTransaction = await rdsdataservice
      .beginTransaction({
        resourceArn: process.env.DATABASE_RESOURCE_ARN /* required */,
        secretArn: process.env.DATABASE_SECRET_ARN /* required */,
        database: process.env.DATABASE_NAME,
      })
      .promise();

    var executeCreateSongs = await rdsdataservice
      .executeStatement({
        resourceArn: process.env.DATABASE_RESOURCE_ARN /* required */,
        secretArn: process.env.DATABASE_SECRET_ARN /* required */,
        sql: `
        INSERT INTO artists(id, name)
        VALUES
        (CAST(:artistid as UUID), (:artist));

        INSERT INTO labels(id, name)
        VALUES
        (CAST(:labelid as UUID), 'Label');  
        
        INSERT INTO publishers(id, name)
        VALUES 
        (CAST(:publisherid as UUID), 'Publisher');  

        INSERT INTO musicalassets(
          id, 
          name,
          type,
          release_year)
      VALUES
      (CAST(:musicalassetid as UUID), (:assetname), (:assettype), (:releaseyear));

      INSERT INTO musicalassets_publishers(musicalassets, publishers)
VALUES
(CAST(:musicalassetid as UUID), CAST(:publisherid as UUID));

INSERT INTO musicalassets_labels(musicalassets, labels)
VALUES
(CAST(:musicalassetid as UUID), CAST(:labelid as UUID));

INSERT INTO musicalassets_artists(musicalassets, artists, main)
VALUES
(CAST(:musicalassetid as UUID), CAST(:artistid as UUID), true);


INSERT INTO musicalworks(id, musicalassets, name, release_year)
VALUES
(CAST(:musicalworkid as UUID), CAST(:musicalassetid as UUID), (:musicalworkname) , (:musicalwork_release_year));

INSERT INTO musicalworks_artists(musicalworks, artists, main)
VALUES
(CAST(:musicalworkid as UUID), CAST(:artistid as UUID), true);


INSERT INTO songwriters(id, name)
VALUES
(CAST(:songwriterid as UUID), 'Songwriter');

INSERT INTO musicalassets_songwriters(songwriters, musicalassets)
VALUES
(CAST(:songwriterid as UUID), CAST(:musicalassetid as UUID));

INSERT INTO musicalassets_musicalworks(musicalassets, musicalworks)
VALUES
(CAST(:musicalassetid as UUID), CAST(:musicalworkid as UUID));

INSERT INTO investments(id, musicalassets, float_date, maturity_date)
VALUES 
(CAST(:investmentid as UUID), CAST(:musicalassetid as UUID), CAST(:floatdate as DATE), CAST(:maturitydate as DATE) );


INSERT INTO copyright_owners(id, name, cognito_id)
VALUES 
(CAST(:copyrightownerid as UUID), (:copyrightownername), CAST(:copyrightownercognitoid as UUID))
ON CONFLICT (id) DO NOTHING;

INSERT INTO contracts(id, copyright_owners, investments)
VALUES
(CAST(:contractid as UUID), CAST(:copyrightownerid as UUID), CAST(:investmentid AS UUID));


INSERT INTO copyright_roles(name, contracts)
VALUES
('label', CAST(:contractid as UUID));

INSERT INTO contracts_revenue_sources(revenue_sources, contracts, amount,  market_percentage)
VALUES
(CAST(:revenue_source as UUID), CAST(:contractid as UUID), (:amount),  (:marketpercentage));



INSERT INTO contracts_revenues(revenues, contracts)
VALUES
((:revenue), CAST(:contractid as UUID));


INSERT INTO musicproducers(id, name)
VALUES
(CAST(:musicproducerid as UUID), 'producent 2');

INSERT INTO musicalassets_musicproducers(musicalassets, musicproducers)
VALUES
(CAST(:musicalassetid as UUID), CAST(:musicproducerid as UUID));

INSERT INTO investments_payouts (investments, planned)
VALUES
(CAST(:investmentid as UUID), CAST(:payoutdate AS DATE));

INSERT INTO sell_orders(id, investments, placed_time, price,  user_id, placed_quantity)
VALUES(CAST(:sellorderid as UUID), CAST(:investmentid as UUID), now(), (:shareprice), CAST(:sellusercognitoid as UUID), (:numberofshares));


INSERT INTO shares(investments, floatprice, sell_orders)
SELECT CAST(:investmentid AS UUID), (:shareprice), CAST(:sellorderid as UUID)
FROM generate_series(1, (:numberofshares)) as a(n)


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
            name: "artist",
            value: {
              stringValue: song.artist,
            },
          },
          {
            name: "publisherid",
            value: {
              stringValue: song.publisherid,
            },
          },
          {
            name: "musicalassetid",
            value: {
              stringValue: song.musicalassetid,
            },
          },
          {
            name: "assetname",
            value: {
              stringValue: song.assetname,
            },
          },
          {
            name: "assettype",
            value: {
              stringValue: song.assettype,
            },
          },
          {
            name: "musicalworkname",
            value: {
              stringValue: song.musicalworkname,
            },
          },
          {
            name: "musicalwork_release_year",
            value: {
              longValue: song.musicalwork_release_year
            }
          },
          {
            name: "investmentid",
            value: {
              stringValue: song.investmentid,
            },
          },
          {
            name: "songwriterid",
            value: {
              stringValue: song.songwriterid,
            },
          },
          {
            name: "contractid",
            value: {
              stringValue: song.contractid,
            },
          },
          {
            name: "musicproducerid",
            value: {
              stringValue: song.musicproducerid,
            },
          },
          {
            name: "sellorderid",
            value: {
              stringValue: song.sellorderid,
            },
          },
          {
            name: "sellusercognitoid",
            value: {
              stringValue: song.sellusercognitoid,
            },
          },
          {
            name: "numberofshares",
            value: {
              longValue: song.numberofshares,
            },
          },
          {
            name: "shareprice",
            value: {
              longValue: song.shareprice,
            },
          },
          {
            name: "amount",
            value: {
              longValue: song.amount,
            },
          },
          {
            name: "marketpercentage",
            value: {
              longValue: song.marketpercentage,
            },
          },
          {
            name: "floatdate",
            value: {
              stringValue: song.floatdate,
            },
          },
          {
            name: "maturitydate",
            value: {
              stringValue: song.maturitydate,
            },
          },
          {
            name: "payoutdate",
            value: {
              stringValue: song.payoutdate,
            },
          },
          {
            name: "revenue",
            value: {
              stringValue: song.revenue,
            },
          },
          {
            name: "revenue_source",
            value: {
              stringValue: song.revenuesource,
            },
          },
        ],
      })
      .promise();

    let commit = await rdsdataservice
      .commitTransaction({
        transactionId: beginTransaction.transactionId,
        resourceArn: process.env.DATABASE_RESOURCE_ARN /* required */,
        secretArn: process.env.DATABASE_SECRET_ARN /* required */,
      })
      .promise();

    return (response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "asset created",
      }),
    });
  } catch (err) {
    console.log(err);
    return err;
  }
  return response;
};