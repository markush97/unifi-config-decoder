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
        <p className='text-gray-600 dark:text-gray-400'>
          Decrypt and analyze UniFi backup files. All processing happens locally in your browser.
        </p>
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
