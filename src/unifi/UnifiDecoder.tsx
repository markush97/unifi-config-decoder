import type { DragEvent } from 'react';
import { useRef, useState } from 'react';

import { analyzeBackup } from '../utils/backupAnalyzer';
import { downloadMongoDump } from '../utils/mongoDumpDownloader';
import { downloadAsZip } from '../utils/zipDownloader';

import { FileUpload } from './components/FileUpload';
import { StatusMessage } from './components/StatusMessage';
import { TabNavigation } from './components/TabNavigation';
import { DevicesTab } from './tabs/DevicesTab';
import { OverviewTab } from './tabs/OverviewTab';
import { SwitchesTab } from './tabs/SwitchesTab';
import { VlansTab } from './tabs/VlansTab';
import { WanTab } from './tabs/WanTab';
import type { BackupInfo, TabType } from './types';
import { hasValidWanData } from './types';

export const UnifiDecoder = () => {
  // State management
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>('');
  const [backupInfo, setBackupInfo] = useState<BackupInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(files[0]);
      fileInputRef.current.files = dt.files;
      handleAnalyzeBackup();
    }
  };

  const handleFileChange = () => {
    handleAnalyzeBackup();
  };

  const handleAnalyzeBackup = async () => {
    try {
      setIsProcessing(true);
      const file = fileInputRef.current?.files?.[0];
      if (!file) throw new Error('No file selected');

      const info = await analyzeBackup(file, setStatus);
      setBackupInfo(info);
      setStatus('✅ Successfully parsed backup!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setStatus(`❌ Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) throw new Error('No file selected');
      await downloadAsZip(file);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setStatus(`❌ Error: ${errorMessage}`);
    }
  };

  const handleDownloadMongoDump = async () => {
    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) throw new Error('No file selected');
      await downloadMongoDump(file, setStatus);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setStatus(`❌ Error: ${errorMessage}`);
    }
  };

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6'>
        <h2 className='font-bold text-2xl text-gray-900 dark:text-white mb-2'>
          UniFi .unf Backup Decoder
        </h2>
        <p className='text-gray-600 dark:text-gray-400 mb-4'>
          Decrypt and analyze UniFi backup files. All processing happens locally in your browser.
        </p>

        {/* Instructions Section */}
        <div className='bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4'>
          <h3 className='font-semibold text-lg text-blue-900 dark:text-blue-100 mb-3 flex items-center'>
            📋 How to get your UniFi backup file (.unf)
          </h3>

          <div className='space-y-4'>
            {/* Method 1: Controller Web Interface */}
            <div>
              <h4 className='font-medium text-blue-800 dark:text-blue-200 mb-2'>
                🌐 Method 1: From UniFi Controller Web Interface
              </h4>
              <ol className='list-decimal list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-4'>
                <li>
                  Open your UniFi Controller web interface (usually http://controller-ip:8443)
                </li>
                <li>Log in with your administrator credentials</li>
                <li>
                  Navigate to <strong>Settings → System → Backup/Restore</strong>
                </li>
                <li>
                  Click <strong>&quot;Download Backup&quot;</strong> to save the .unf file
                </li>
              </ol>
            </div>

            {/* Method 2: Site Manager */}
            <div>
              <h4 className='font-medium text-blue-800 dark:text-blue-200 mb-2'>
                📱 Method 2: Using UniFi Site Manager (when console is offline)
              </h4>
              <ol className='list-decimal list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-4'>
                <li>
                  Open the <strong>UniFi Site Manager</strong> mobile app or web portal
                </li>
                <li>Select your site from the list</li>
                <li>
                  Go to <strong>Settings → System → Backup</strong>
                </li>
                <li>
                  Tap <strong>&quot;Download Backup&quot;</strong> or{' '}
                  <strong>&quot;Export Configuration&quot;</strong>
                </li>
                <li>The .unf file will be downloaded to your device</li>
              </ol>
            </div>

            {/* Method 3: SSH/CLI */}
            <div>
              <h4 className='font-medium text-blue-800 dark:text-blue-200 mb-2'>
                🖥️ Method 3: SSH/Command Line (Advanced)
              </h4>
              <ol className='list-decimal list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1 ml-4'>
                <li>SSH into your UniFi Controller or Cloud Key</li>
                <li>
                  Navigate to the UniFi directory (usually{' '}
                  <code className='bg-blue-100 dark:bg-blue-800 px-1 rounded'>
                    /opt/unifi/data/backup/autobackup/
                  </code>
                  )
                </li>
                <li>Look for recent .unf files and copy them to your local machine</li>
              </ol>
            </div>

            {/* Important Notes */}
            <div className='bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded p-3 mt-4'>
              <p className='text-sm text-yellow-800 dark:text-yellow-200'>
                <strong>💡 Important:</strong> The backup file contains sensitive network
                configuration data. Keep it secure and only use it for legitimate network analysis
                purposes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <FileUpload
          fileInputRef={fileInputRef}
          isDragging={isDragging}
          isProcessing={isProcessing}
          hasConfigDecoded={backupInfo !== null}
          onFileChange={handleFileChange}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDownloadZip={handleDownloadZip}
          onDownloadMongoDump={handleDownloadMongoDump}
        />

        <StatusMessage status={status} />

        {backupInfo && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              switchCount={backupInfo.switches.length}
              deviceCount={backupInfo.otherDevices.length}
              wanCount={backupInfo.wanConfigs.filter(wan => hasValidWanData(wan)).length}
              vlanCount={backupInfo.vlanConfigs.length}
            />

            <div>
              {activeTab === 'overview' && <OverviewTab backupInfo={backupInfo} />}
              {activeTab === 'switches' && (
                <SwitchesTab
                  devices={backupInfo.switches}
                  portConfigs={backupInfo.portConfigs}
                  allNetworkConfs={backupInfo.allNetworkConfs}
                  defaultVlanId={
                    backupInfo.allNetworkConfs
                      .find((n: Record<string, unknown>) => {
                        const id = n._id;
                        const idStr = typeof id === 'string' ? id : id?.toString?.() || '';
                        return n.vlan === 1 || n.name === 'Default' || idStr === '1';
                      })
                      ?._id?.toString?.() || undefined
                  }
                />
              )}
              {activeTab === 'devices' && <DevicesTab devices={backupInfo.otherDevices} />}
              {activeTab === 'wan' && <WanTab wanConfigs={backupInfo.wanConfigs} />}
              {activeTab === 'vlans' && <VlansTab vlanConfigs={backupInfo.vlanConfigs} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
