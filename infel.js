const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const pathToCsv = path.resolve('infelData.csv');

const csvWriter = createCsvWriter({
    path: 'your_path_goes_here',
    header: [
      {id: 'isp', title: 'ISP'},
      {id: 'download', title: 'Download'},
      {id: 'upload', title: 'Upload'},
      {id: 'timestamp', title: 'Timestamp'},
    ],
    append: true,
});

const getSpeed = async () => {
    console.log('Starting speedtest...');
    const { stdout, stderr } = await exec('/usr/bin/python3 path_to_speedtest_cli/speedtest.py --json');
    const { download, upload, timestamp, client: { isp } } = JSON.parse(stdout);
    console.log('Data gathered...');
    return [{
        isp,
        download: `${(download / 1e+6).toFixed(2)} Mbit/s`,
        upload: `${(upload / 1e+6).toFixed(2)} Mbit/s`,
        timestamp,
    }]
}

(async () => {
    try {
        const data = await getSpeed();
        await csvWriter.writeRecords(data);
        console.log(`Data written to CSV on ${new Date()}`)
    } catch (e) {
        console.log(e);
    }
})();
