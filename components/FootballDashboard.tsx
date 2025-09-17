import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { footballApiService } from '../services/footballApi';
import { Competition, Match, Scorer, Standing, Team } from '../types/football';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

const { width } = Dimensions.get('window');

// Request queue için delay utility
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// FIFA tarzı pozisyon kısaltmaları ve renkleri
const getPositionAbbreviation = (position: string): string => {
  const pos = position.toLowerCase();
  if (pos.includes('goalkeeper') || pos.includes('kaleci')) return 'GK';
  if (pos.includes('centre-back') || pos.includes('stoper') || pos.includes('center back') || pos.includes('de') || pos.includes('cb')) return 'CB';
  if (pos.includes('left-back') || pos.includes('sol bek') || pos.includes('de') || pos.includes('lb')) return 'LB';
  if (pos.includes('right-back') || pos.includes('sağ bek') || pos.includes('de') || pos.includes('rb')) return 'RB';
  if (pos.includes('defensive midfielder') || pos.includes('defansif orta saha') || pos.includes('defensive mid')) return 'DM';
  if (pos.includes('central midfielder') || pos.includes('orta saha') || pos.includes('midfielder') || pos.includes('mid')) return 'CM';
  if (pos.includes('attacking midfielder') || pos.includes('hücum orta saha') || pos.includes('attacking mid')) return 'AM';
  if (pos.includes('left winger') || pos.includes('sol kanat') || pos.includes('left wing') || pos.includes('of') || pos.includes('lw')) return 'LW';
  if (pos.includes('right winger') || pos.includes('sağ kanat') || pos.includes('right wing') || pos.includes('of') || pos.includes('rw')) return 'RW';
  if (pos.includes('striker') || pos.includes('forvet') || pos.includes('santrafor')) return 'ST';
  if (pos.includes('centre-forward') || pos.includes('center forward')) return 'CF';
  if (pos.includes('second striker') || pos.includes('ikinci forvet')) return 'SS';
  if (pos.includes('wing back') || pos.includes('kanat bek')) return 'WB';
  if (pos.includes('sweeper') || pos.includes('süpürücü')) return 'SW';
  if (pos.includes('false nine') || pos.includes('sahte dokuz')) return 'F9';
  if (pos.includes('number ten') || pos.includes('on numara')) return '10';
  if (pos.includes('box to box') || pos.includes('kutu kutu')) return 'B2B';
  if (pos.includes('holding midfielder') || pos.includes('tutucu orta saha')) return 'HM';
  if (pos.includes('playmaker') || pos.includes('oyun kurucu')) return 'PM';
  if (pos.includes('target man') || pos.includes('hedef adam')) return 'TM';
  if (pos.includes('poacher') || pos.includes('avcı')) return 'PO';
  if (pos.includes('complete forward') || pos.includes('tam forvet')) return 'CF';
  if (pos.includes('inside forward') || pos.includes('iç forvet')) return 'IF';
  if (pos.includes('deep lying forward') || pos.includes('derin forvet')) return 'DLF';
  if (pos.includes('advanced playmaker') || pos.includes('ileri oyun kurucu')) return 'AP';
  if (pos.includes('deep lying playmaker') || pos.includes('derin oyun kurucu')) return 'DLP';
  if (pos.includes('ball winning midfielder') || pos.includes('top kazanan orta saha')) return 'BWM';
  if (pos.includes('mezzala') || pos.includes('mezzala')) return 'MEZ';
  if (pos.includes('carrilero') || pos.includes('karrilero')) return 'CAR';
  if (pos.includes('regista') || pos.includes('regista')) return 'REG';
  if (pos.includes('segundo volante') || pos.includes('ikinci volante')) return 'SV';
  if (pos.includes('volante') || pos.includes('volante')) return 'VOL';
  if (pos.includes('libero') || pos.includes('libero')) return 'LIB';
  if (pos.includes('ncb') || pos.includes('ncb')) return 'NCB';
  if (pos.includes('wb') || pos.includes('wb')) return 'WB';
  if (pos.includes('dm') || pos.includes('dm')) return 'DM';
  if (pos.includes('cm') || pos.includes('cm')) return 'CM';
  if (pos.includes('am') || pos.includes('am')) return 'AM';
  if (pos.includes('lw') || pos.includes('lw')) return 'LW';
  if (pos.includes('rw') || pos.includes('rw')) return 'RW';
  if (pos.includes('st') || pos.includes('st')) return 'ST';
  if (pos.includes('cf') || pos.includes('cf')) return 'CF';
  if (pos.includes('ss') || pos.includes('ss')) return 'SS';
  if (pos.includes('gk') || pos.includes('gk')) return 'GK';
  if (pos.includes('cb') || pos.includes('cb')) return 'CB';
  if (pos.includes('lb') || pos.includes('lb')) return 'LB';
  if (pos.includes('rb') || pos.includes('rb')) return 'RB';
  return position.substring(0, 2).toUpperCase();
};

const getPositionStyle = (position: string): any => {
  const pos = position.toLowerCase();
  if (pos.includes('goalkeeper') || pos.includes('kaleci') || pos.includes('gk')) return { backgroundColor: '#FF6B6B', color: 'white' };
  if (pos.includes('centre-back') || pos.includes('stoper') || pos.includes('center back') || pos.includes('cb') || pos.includes('de')) return { backgroundColor: '#4ECDC4', color: 'white' };
  if (pos.includes('left-back') || pos.includes('sol bek') || pos.includes('lb') || pos.includes('de')) return { backgroundColor: '#45B7D1', color: 'white' };
  if (pos.includes('right-back') || pos.includes('sağ bek') || pos.includes('rb') || pos.includes('de')) return { backgroundColor: '#45B7D1', color: 'white' };
  if (pos.includes('defensive midfielder') || pos.includes('defansif orta saha') || pos.includes('defensive mid') || pos.includes('dm')) return { backgroundColor: '#96CEB4', color: 'white' };
  if (pos.includes('central midfielder') || pos.includes('orta saha') || pos.includes('midfielder') || pos.includes('mid') || pos.includes('cm')) return { backgroundColor: '#FFEAA7', color: '#2D3436' };
  if (pos.includes('attacking midfielder') || pos.includes('hücum orta saha') || pos.includes('attacking mid') || pos.includes('am')) return { backgroundColor: '#DDA0DD', color: 'white' };
  if (pos.includes('left winger') || pos.includes('sol kanat') || pos.includes('left wing') || pos.includes('lw') || pos.includes('of')) return { backgroundColor: '#FF8C42', color: 'white' };
  if (pos.includes('right winger') || pos.includes('sağ kanat') || pos.includes('right wing') || pos.includes('rw') || pos.includes('of')) return { backgroundColor: '#FF8C42', color: 'white' };
  if (pos.includes('striker') || pos.includes('forvet') || pos.includes('santrafor') || pos.includes('st')) return { backgroundColor: '#FF4757', color: 'white' };
  if (pos.includes('centre-forward') || pos.includes('center forward') || pos.includes('cf')) return { backgroundColor: '#FF4757', color: 'white' };
  if (pos.includes('second striker') || pos.includes('ikinci forvet') || pos.includes('ss')) return { backgroundColor: '#FF6B9D', color: 'white' };
  if (pos.includes('wing back') || pos.includes('kanat bek') || pos.includes('wb')) return { backgroundColor: '#4ECDC4', color: 'white' };
  if (pos.includes('sweeper') || pos.includes('süpürücü') || pos.includes('sw')) return { backgroundColor: '#4ECDC4', color: 'white' };
  if (pos.includes('false nine') || pos.includes('sahte dokuz') || pos.includes('f9')) return { backgroundColor: '#FF4757', color: 'white' };
  if (pos.includes('number ten') || pos.includes('on numara') || pos.includes('10')) return { backgroundColor: '#DDA0DD', color: 'white' };
  if (pos.includes('box to box') || pos.includes('kutu kutu') || pos.includes('b2b')) return { backgroundColor: '#FFEAA7', color: '#2D3436' };
  if (pos.includes('holding midfielder') || pos.includes('tutucu orta saha') || pos.includes('hm')) return { backgroundColor: '#96CEB4', color: 'white' };
  if (pos.includes('playmaker') || pos.includes('oyun kurucu') || pos.includes('pm')) return { backgroundColor: '#DDA0DD', color: 'white' };
  if (pos.includes('target man') || pos.includes('hedef adam') || pos.includes('tm')) return { backgroundColor: '#FF4757', color: 'white' };
  if (pos.includes('poacher') || pos.includes('avcı') || pos.includes('po')) return { backgroundColor: '#FF4757', color: 'white' };
  if (pos.includes('complete forward') || pos.includes('tam forvet')) return { backgroundColor: '#FF4757', color: 'white' };
  if (pos.includes('inside forward') || pos.includes('iç forvet') || pos.includes('if')) return { backgroundColor: '#FF8C42', color: 'white' };
  if (pos.includes('deep lying forward') || pos.includes('derin forvet') || pos.includes('dlf')) return { backgroundColor: '#FF4757', color: 'white' };
  if (pos.includes('advanced playmaker') || pos.includes('ileri oyun kurucu') || pos.includes('ap')) return { backgroundColor: '#DDA0DD', color: 'white' };
  if (pos.includes('deep lying playmaker') || pos.includes('derin oyun kurucu') || pos.includes('dlp')) return { backgroundColor: '#DDA0DD', color: 'white' };
  if (pos.includes('ball winning midfielder') || pos.includes('top kazanan orta saha') || pos.includes('bwm')) return { backgroundColor: '#96CEB4', color: 'white' };
  if (pos.includes('mezzala') || pos.includes('mezzala') || pos.includes('mez')) return { backgroundColor: '#FFEAA7', color: '#2D3436' };
  if (pos.includes('carrilero') || pos.includes('karrilero') || pos.includes('car')) return { backgroundColor: '#FFEAA7', color: '#2D3436' };
  if (pos.includes('regista') || pos.includes('regista') || pos.includes('reg')) return { backgroundColor: '#DDA0DD', color: 'white' };
  if (pos.includes('segundo volante') || pos.includes('ikinci volante') || pos.includes('sv')) return { backgroundColor: '#96CEB4', color: 'white' };
  if (pos.includes('volante') || pos.includes('volante') || pos.includes('vol')) return { backgroundColor: '#96CEB4', color: 'white' };
  if (pos.includes('libero') || pos.includes('libero') || pos.includes('lib')) return { backgroundColor: '#4ECDC4', color: 'white' };
  if (pos.includes('ncb')) return { backgroundColor: '#4ECDC4', color: 'white' };
  return { backgroundColor: '#95A5A6', color: 'white' }; // Varsayılan gri
};

// Mevkilere göre sıralama fonksiyonu
const getPositionOrder = (position: string): number => {
  const pos = position.toLowerCase();
  if (pos.includes('goalkeeper') || pos.includes('kaleci') || pos.includes('gk')) return 1; // Kaleci
  if (pos.includes('centre-back') || pos.includes('stoper') || pos.includes('center back') || pos.includes('cb') ||
      pos.includes('left-back') || pos.includes('sol bek') || pos.includes('lb') ||
      pos.includes('right-back') || pos.includes('sağ bek') || pos.includes('rb') ||
      pos.includes('wing back') || pos.includes('kanat bek') || pos.includes('wb') ||
      pos.includes('sweeper') || pos.includes('süpürücü') || pos.includes('sw') ||
      pos.includes('libero') || pos.includes('lib') || pos.includes('ncb')) return 2; // Defans
  if (pos.includes('defensive midfielder') || pos.includes('defansif orta saha') || pos.includes('defensive mid') || pos.includes('dm') ||
      pos.includes('central midfielder') || pos.includes('orta saha') || pos.includes('midfielder') || pos.includes('mid') || pos.includes('cm') ||
      pos.includes('attacking midfielder') || pos.includes('hücum orta saha') || pos.includes('attacking mid') || pos.includes('am') ||
      pos.includes('holding midfielder') || pos.includes('tutucu orta saha') || pos.includes('hm') ||
      pos.includes('playmaker') || pos.includes('oyun kurucu') || pos.includes('pm') ||
      pos.includes('box to box') || pos.includes('kutu kutu') || pos.includes('b2b') ||
      pos.includes('ball winning midfielder') || pos.includes('top kazanan orta saha') || pos.includes('bwm') ||
      pos.includes('mezzala') || pos.includes('mez') ||
      pos.includes('carrilero') || pos.includes('car') ||
      pos.includes('regista') || pos.includes('reg') ||
      pos.includes('segundo volante') || pos.includes('ikinci volante') || pos.includes('sv') ||
      pos.includes('volante') || pos.includes('vol') ||
      pos.includes('advanced playmaker') || pos.includes('ileri oyun kurucu') || pos.includes('ap') ||
      pos.includes('deep lying playmaker') || pos.includes('derin oyun kurucu') || pos.includes('dlp')) return 3; // Orta saha
  if (pos.includes('left winger') || pos.includes('sol kanat') || pos.includes('left wing') || pos.includes('lw') ||
      pos.includes('right winger') || pos.includes('sağ kanat') || pos.includes('right wing') || pos.includes('rw') ||
      pos.includes('striker') || pos.includes('forvet') || pos.includes('santrafor') || pos.includes('st') ||
      pos.includes('centre-forward') || pos.includes('center forward') || pos.includes('cf') ||
      pos.includes('second striker') || pos.includes('ikinci forvet') || pos.includes('ss') ||
      pos.includes('false nine') || pos.includes('sahte dokuz') || pos.includes('f9') ||
      pos.includes('target man') || pos.includes('hedef adam') || pos.includes('tm') ||
      pos.includes('poacher') || pos.includes('avcı') || pos.includes('po') ||
      pos.includes('complete forward') || pos.includes('tam forvet') ||
      pos.includes('inside forward') || pos.includes('iç forvet') || pos.includes('if') ||
      pos.includes('deep lying forward') || pos.includes('derin forvet') || pos.includes('dlf') ||
      pos.includes('number ten') || pos.includes('on numara') || pos.includes('10')) return 4; // Forvet
  return 5; // Diğer pozisyonlar
};

// Mevki başlığı fonksiyonu
const getPositionTitle = (position: string): string => {
  const pos = position.toLowerCase();
  if (pos.includes('goalkeeper') || pos.includes('kaleci') || pos.includes('gk')) return '🥅 Kaleci';
  if (pos.includes('centre-back') || pos.includes('stoper') || pos.includes('center back') || pos.includes('cb') ||
      pos.includes('left-back') || pos.includes('sol bek') || pos.includes('lb') ||
      pos.includes('right-back') || pos.includes('sağ bek') || pos.includes('rb') ||
      pos.includes('wing back') || pos.includes('kanat bek') || pos.includes('wb') ||
      pos.includes('sweeper') || pos.includes('süpürücü') || pos.includes('sw') ||
      pos.includes('libero') || pos.includes('lib') || pos.includes('ncb')) return '🛡️ Defans';
  if (pos.includes('defensive midfielder') || pos.includes('defansif orta saha') || pos.includes('defensive mid') || pos.includes('dm') ||
      pos.includes('central midfielder') || pos.includes('orta saha') || pos.includes('midfielder') || pos.includes('mid') || pos.includes('cm') ||
      pos.includes('attacking midfielder') || pos.includes('hücum orta saha') || pos.includes('attacking mid') || pos.includes('am') ||
      pos.includes('holding midfielder') || pos.includes('tutucu orta saha') || pos.includes('hm') ||
      pos.includes('playmaker') || pos.includes('oyun kurucu') || pos.includes('pm') ||
      pos.includes('box to box') || pos.includes('kutu kutu') || pos.includes('b2b') ||
      pos.includes('ball winning midfielder') || pos.includes('top kazanan orta saha') || pos.includes('bwm') ||
      pos.includes('mezzala') || pos.includes('mez') ||
      pos.includes('carrilero') || pos.includes('car') ||
      pos.includes('regista') || pos.includes('reg') ||
      pos.includes('segundo volante') || pos.includes('ikinci volante') || pos.includes('sv') ||
      pos.includes('volante') || pos.includes('vol') ||
      pos.includes('advanced playmaker') || pos.includes('ileri oyun kurucu') || pos.includes('ap') ||
      pos.includes('deep lying playmaker') || pos.includes('derin oyun kurucu') || pos.includes('dlp')) return '⚽ Orta Saha';
  if (pos.includes('left winger') || pos.includes('sol kanat') || pos.includes('left wing') || pos.includes('lw') ||
      pos.includes('right winger') || pos.includes('sağ kanat') || pos.includes('right wing') || pos.includes('rw') ||
      pos.includes('striker') || pos.includes('forvet') || pos.includes('santrafor') || pos.includes('st') ||
      pos.includes('centre-forward') || pos.includes('center forward') || pos.includes('cf') ||
      pos.includes('second striker') || pos.includes('ikinci forvet') || pos.includes('ss') ||
      pos.includes('false nine') || pos.includes('sahte dokuz') || pos.includes('f9') ||
      pos.includes('target man') || pos.includes('hedef adam') || pos.includes('tm') ||
      pos.includes('poacher') || pos.includes('avcı') || pos.includes('po') ||
      pos.includes('complete forward') || pos.includes('tam forvet') ||
      pos.includes('inside forward') || pos.includes('iç forvet') || pos.includes('if') ||
      pos.includes('deep lying forward') || pos.includes('derin forvet') || pos.includes('dlf') ||
      pos.includes('number ten') || pos.includes('on numara') || pos.includes('10')) return '🚀 Forvet';
  return '❓ Diğer';
};

export default function FootballDashboard() {
  const [activeTab, setActiveTab] = useState<'leagues' | 'teams'>('leagues');
  const [refreshing, setRefreshing] = useState(false);
  
  // Veri state'leri
  const [todaysMatches, setTodaysMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  
  // Lig detayları için yeni state'ler
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [leagueDetails, setLeagueDetails] = useState<{
    competition: Competition | null;
    standings: Standing[];
    topScorers: Scorer[];
    teams: any[];
    matches: Match[];
    loading: boolean;
  }>({
    competition: null,
    standings: [],
    topScorers: [],
    teams: [],
    matches: [],
    loading: false,
  });

  // Loading state'leri
  const [loading, setLoading] = useState({
    matches: false,
    competitions: false,
  });

  // Veri yükleme fonksiyonları
  const loadTodaysMatches = async () => {
    setLoading(prev => ({ ...prev, matches: true }));
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await footballApiService.getMatches({ 
        dateFrom: today, 
        dateTo: today 
      });
      setTodaysMatches(response.matches || []);
    } catch (error: any) {
      if (error?.response?.status === 429) {
        console.log('Rate limit aşıldı, bugünün maçları yüklenemedi');
      } else {
        console.error('Bugünün maçları yüklenemedi:', error);
        Alert.alert('Hata', 'Bugünün maçları yüklenemedi');
      }
    } finally {
      setLoading(prev => ({ ...prev, matches: false }));
    }
  };

  const loadLiveMatches = async () => {
    try {
      const response = await footballApiService.getMatches({ status: 'LIVE' });
      setLiveMatches(response.matches || []);
    } catch (error: any) {
      if (error?.response?.status === 429) {
        console.log('Rate limit aşıldı, canlı maçlar güncellenmedi');
      } else {
        console.error('Canlı maçlar yüklenemedi:', error);
      }
    }
  };

  const loadCompetitions = async () => {
    setLoading(prev => ({ ...prev, competitions: true }));
    try {
      const response = await footballApiService.getCompetitions();
      const comps = response.competitions || [];
      setCompetitions(comps);
      // Artık otomatik lig detayları yüklenmeyecek - sadece liste
    } catch (error: any) {
      if (error?.response?.status === 429) {
        console.log('Rate limit aşıldı, ligler yüklenemedi');
        Alert.alert('Bilgi', 'API limit aşıldı, lütfen biraz bekleyin');
      } else {
        console.error('Ligler yüklenemedi:', error);
        Alert.alert('Hata', 'Ligler yüklenemedi');
      }
    } finally {
      setLoading(prev => ({ ...prev, competitions: false }));
    }
  };



  // Lig seçildiğinde tüm detaylarını yükle
  const loadLeagueDetails = async (leagueCode: string) => {
    setLeagueDetails(prev => ({ ...prev, loading: true }));
    setSelectedLeague(leagueCode);
    
    try {
      console.log(`${leagueCode} ligi detayları yükleniyor...`);
      

      
      // Mevcut sezonu dene, başarısız olursa önceki sezonu dene
      let currentSeason = new Date().getFullYear();
      let standingsData;
      
                    try {
         // 1. Puan durumu - birden fazla sezonu dene
         const seasonsToTry = [currentSeason, currentSeason - 1, currentSeason - 2, currentSeason - 3];
         let standingsFound = false;
         
         for (const season of seasonsToTry) {
           try {
             console.log(`${season} sezonu deneniyor...`);
             standingsData = await footballApiService.getCompetitionStandings(leagueCode, { 
               season: season 
             });
             
             if (standingsData && standingsData.standings && standingsData.standings.length > 0) {
               currentSeason = season;
               console.log(`Standings bulundu: ${season} sezonu`);
               standingsFound = true;
               break;
             }
           } catch (seasonError: any) {
             if (seasonError?.response?.status === 404) {
               console.log(`${season} sezonu bulunamadı, sonraki sezon deneniyor...`);
               continue;
             } else {
               console.error(`${season} sezonu için hata:`, seasonError);
               throw seasonError;
             }
           }
         }
         
                  if (!standingsFound || !standingsData) {
           throw new Error('Hiçbir sezon için standings bulunamadı');
         }
         
         console.log('Standings response (final season):', standingsData);
       } catch (standingsError: any) {
         console.error('Standings yüklenemedi:', standingsError);
         throw standingsError;
       }
       
       await delay(3000); // 3 saniye bekle (rate limit için)
       
       // 2. Gol krallığı - aynı sezonu kullan
       const scorersData = await footballApiService.getCompetitionScorers(leagueCode, { 
         limit: 10,
         season: currentSeason
       });
       console.log('Scorers response:', scorersData);
       await delay(3000); // 3 saniye bekle (rate limit için)
       
       // 3. Takımlar - aynı sezonu kullan
       const teamsData = await footballApiService.getCompetitionTeams(leagueCode, currentSeason);
       console.log('Teams response:', teamsData);
       await delay(3000); // 3 saniye bekle (rate limit için)
       
       // 4. Son maçlar - aynı sezonu kullan
       const matchesData = await footballApiService.getCompetitionMatches(leagueCode, { 
         limit: 10,
         season: currentSeason
       });
       console.log('Matches response:', matchesData);
       
       // Veri yapısını kontrol et ve güvenli şekilde ayarla
       let standings = [];
       const scorers = scorersData.scorers || [];
       const teams = teamsData.teams || [];
       const matches = matchesData.matches || [];
       
       // Standings verisi farklı yapılarda olabilir, alternatif yolları dene
       console.log('StandingsData yapısı analiz ediliyor...');
       console.log('StandingsData.standings:', standingsData?.standings);
       console.log('StandingsData.standings length:', standingsData?.standings?.length);
       
       if (standingsData?.standings && standingsData.standings.length > 0) {
         // API v4'te standings bir array ve her element bir group
         for (const standingGroup of standingsData.standings) {
           console.log('StandingGroup:', standingGroup);
           console.log('StandingGroup keys:', Object.keys(standingGroup));
           
           if ((standingGroup as any).table && Array.isArray((standingGroup as any).table)) {
             console.log('Table bulundu, length:', (standingGroup as any).table.length);
             standings = (standingGroup as any).table;
             break;
           } else if ((standingGroup as any).standings && Array.isArray((standingGroup as any).standings)) {
             console.log('Standings bulundu, length:', (standingGroup as any).standings.length);
             standings = (standingGroup as any).standings;
             break;
           }
         }
       }
       
       // Eğer hala standings bulunamadıysa, alternatif yolları dene
       if (standings.length === 0) {
         console.log('Standings bulunamadı, alternatif yapıları kontrol ediliyor...');
         
         // Alternatif 1: standingsData direkt standings array olabilir
         if (Array.isArray(standingsData)) {
           standings = standingsData;
           console.log('StandingsData direkt array olarak bulundu');
         }
         // Alternatif 2: standingsData.standingsTable olabilir
         else if (standingsData && (standingsData as any).standingsTable && Array.isArray((standingsData as any).standingsTable)) {
           standings = (standingsData as any).standingsTable;
           console.log('StandingsData.standingsTable bulundu');
         }
         // Alternatif 3: standingsData.table olabilir
         else if (standingsData && (standingsData as any).table && Array.isArray((standingsData as any).table)) {
           standings = (standingsData as any).table;
           console.log('StandingsData.table bulundu');
         }
         // Alternatif 4: standingsData.competition?.standings olabilir ama farklı yerde
         else if (standingsData && (standingsData as any).competition?.standings && Array.isArray((standingsData as any).competition.standings)) {
           standings = (standingsData as any).competition.standings;
           console.log('StandingsData.competition.standings bulundu');
         }
       }
       
       console.log(`Final standings count: ${standings.length}`);
       console.log(`Scorers count: ${scorers.length}`);
       console.log(`Teams count: ${teams.length}`);
       console.log(`Matches count: ${matches.length}`);
       
       // API response yapısını detaylı incele
       if (standingsData) {
         console.log('StandingsData full response:', JSON.stringify(standingsData, null, 2));
         console.log('StandingsData.standings:', standingsData.standings);
         console.log('StandingsData type:', typeof standingsData.standings);
         console.log('StandingsData keys:', Object.keys(standingsData));
         
         // API response status ve headers'ı da kontrol et
         console.log('API Response Status:', standingsData);
         console.log('API Response Headers:', standingsData);
       }
       
       if (standings.length === 0) {
         console.warn('⚠️ Standings array boş! API response yapısını kontrol et');
         console.warn('StandingsData object:', standingsData);
         console.warn('StandingsData type:', typeof standingsData);
         if (standingsData) {
           console.warn('StandingsData keys:', Object.keys(standingsData));
         }
       }
      
      setLeagueDetails({
         competition: standingsData?.competition || null,
         standings: standings,
         topScorers: scorers,
         teams: teams,
         matches: matches,
        loading: false,
      });
      
      console.log(`${leagueCode} ligi detayları başarıyla yüklendi (${currentSeason} sezonu)`);
    } catch (error: any) {
      console.error(`${leagueCode} ligi detayları yüklenemedi:`, error);
      
      if (error?.response?.status === 429) {
        console.log(`Rate limit aşıldı, ${leagueCode} ligi detayları yüklenemedi`);
        Alert.alert('Rate Limit', 'API limit aşıldı. Lütfen 1-2 dakika bekleyip tekrar deneyin.');
      } else if (error?.response?.status === 404) {
        console.log(`${leagueCode} ligi bulunamadı`);
        Alert.alert('Hata', 'Lig bulunamadı. Lütfen farklı bir lig seçin.');
      } else if (error?.response?.status === 403) {
        console.log(`${leagueCode} ligi için erişim reddedildi`);
        Alert.alert('Erişim Hatası', 'Bu lig için erişim reddedildi. Lütfen farklı bir lig seçin.');
      } else {
        console.error(`${leagueCode} ligi detayları yüklenemedi:`, error);
        Alert.alert('Hata', 'Lig detayları yüklenemedi. Lütfen tekrar deneyin.');
      }
      setLeagueDetails(prev => ({ ...prev, loading: false }));
    }
  };

  // Yenileme fonksiyonu - sadece temel veriler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Sadece temel verileri yükle - minimum API çağrısı
      await loadTodaysMatches();
      await delay(2000); // 2 saniye bekle
      
      await loadLiveMatches();
      await delay(2000); // 2 saniye bekle
      
      await loadCompetitions(); // Sadece lig listesi
      // Lig detayları manuel seçimde yüklenecek
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    onRefresh();
  }, []);

  // Canlı maçları periyodik olarak güncelle (rate limiting için çok uzun aralık)
  useEffect(() => {
    const interval = setInterval(loadLiveMatches, 300000); // 5 dakikada bir
    return () => clearInterval(interval);
  }, []);

  // Maç durumuna göre renk
  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
      case 'IN_PLAY':
        return '#FF3B30';
      case 'PAUSED':
        return '#FF9500';
      case 'FINISHED':
        return '#34C759';
      case 'SCHEDULED':
        return '#007AFF';
      default:
        return '#8E8E93';
    }
  };

  // UTC tarihini Türkiye saatine çevir
  const convertToTurkeyTime = (utcDate: string) => {
    try {
      const date = new Date(utcDate);
      // Türkiye UTC+3
      const turkeyTime = new Date(date.getTime() + (3 * 60 * 60 * 1000));
      return turkeyTime.toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Tarih çevirme hatası:', error);
      return utcDate;
    }
  };

  // Maç durumunu kontrol et ve güncelle
  const getUpdatedMatchStatus = (match: Match) => {
    if (!match.utcDate) return match.status || 'SCHEDULED';
    
    try {
      const matchDate = new Date(match.utcDate);
      const now = new Date();
      const turkeyTime = new Date(now.getTime() + (3 * 60 * 60 * 1000)); // Türkiye saati
      
      // Maç 90 dakika + ek süre sonra biter (yaklaşık 2 saat)
      const matchEndTime = new Date(matchDate.getTime() + (2 * 60 * 60 * 1000));
      
      if (turkeyTime < matchDate) {
        return 'SCHEDULED'; // Henüz başlamamış
      } else if (turkeyTime >= matchDate && turkeyTime < matchEndTime) {
        return 'LIVE'; // Canlı
      } else {
        return 'FINISHED'; // Bitti
      }
    } catch (error) {
      console.error('Maç durumu güncelleme hatası:', error);
      return match.status || 'SCHEDULED';
    }
  };

  // Maç kartı komponenti
  const MatchCard = ({ match, onPress }: { match: Match; onPress?: () => void }) => {
    if (!match || !match.homeTeam || !match.awayTeam) {
      return null;
    }

    return (
      <TouchableOpacity 
        style={styles.matchCard}
        onPress={onPress}
        disabled={!onPress}
      >
        <ThemedView style={styles.matchHeader}>
          <ThemedText style={styles.competitionName}>
            {match.competition?.name || 'Bilinmeyen Lig'}
          </ThemedText>
          <ThemedView style={[
            styles.statusBadge, 
            { backgroundColor: getMatchStatusColor(getUpdatedMatchStatus(match)) }
          ]}>
            <ThemedText style={styles.statusText}>
              {getUpdatedMatchStatus(match) === 'LIVE' || getUpdatedMatchStatus(match) === 'IN_PLAY' ? 'CANLI' : 
               getUpdatedMatchStatus(match) === 'FINISHED' ? 'BİTTİ' : 
               getUpdatedMatchStatus(match) === 'SCHEDULED' ? 'PLANLI' : getUpdatedMatchStatus(match)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.matchContent}>
          <ThemedView style={styles.team}>
            <ThemedText style={styles.teamName}>
              {match.homeTeam.shortName || match.homeTeam.name || 'Ev Sahibi'}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.vsContainer}>
            {match.score && match.score.fullTime && 
             (match.score.fullTime.home !== null && match.score.fullTime.away !== null) ? (
              <>
                <ThemedText style={styles.score}>
                  {match.score.fullTime.home} - {match.score.fullTime.away}
                </ThemedText>
                {match.status === 'LIVE' && match.minute && (
                  <ThemedText style={styles.minuteText}>{match.minute}'</ThemedText>
                )}
              </>
            ) : (
              <ThemedText style={styles.vsText}>VS</ThemedText>
            )}
            <ThemedText style={styles.matchTime}>
              {match.utcDate ? convertToTurkeyTime(match.utcDate) : 'Saat bilinmiyor'}
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.team}>
            <ThemedText style={styles.teamName}>
              {match.awayTeam.shortName || match.awayTeam.name || 'Misafir'}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    );
  };

    // Maç detayları komponenti
  const MatchDetails = ({ match, onBack }: { match: Match; onBack: () => void }) => {
    return (
      <ThemedView style={styles.matchDetailsContainer}>
        <ThemedView style={styles.pageHeader}>
          <ThemedView style={styles.pageTitle}>
          <IconSymbol name="soccer.ball" size={24} color="#FF6B6B" />
          <ThemedText style={styles.pageTitle}> Maç Detayları</ThemedText>
        </ThemedView>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ThemedText style={styles.backButtonIcon}>←</ThemedText>
            <ThemedText style={styles.backButtonText}>Geri</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Maç Özeti */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>🏆 {match.competition?.name}</ThemedText>
          <ThemedView style={styles.matchHeader}>
            <ThemedView style={styles.team}>
              {match.homeTeam.crest && (
                <Image source={{ uri: match.homeTeam.crest }} style={styles.teamCardCrest} resizeMode="contain" />
              )}
              <ThemedText style={styles.teamName}>{match.homeTeam.shortName || match.homeTeam.name}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.vsContainer}>
              {match.score?.fullTime?.home !== null && match.score?.fullTime?.away !== null ? (
                <ThemedText style={styles.score}>
                  {match.score.fullTime.home} - {match.score.fullTime.away}
                </ThemedText>
              ) : (
                <ThemedText style={styles.vsText}>VS</ThemedText>
              )}
              <ThemedText style={styles.matchTime}>
                {match.utcDate ? convertToTurkeyTime(match.utcDate) : 'Tarih bilinmiyor'}
              </ThemedText>
              {match.status === 'LIVE' && match.minute && (
                <ThemedText style={styles.minuteText}>{match.minute}'</ThemedText>
              )}
            </ThemedView>
            
            <ThemedView style={styles.team}>
              {match.awayTeam.crest && (
                <Image source={{ uri: match.awayTeam.crest }} style={styles.teamCardCrest} resizeMode="contain" />
              )}
              <ThemedText style={styles.teamName}>{match.awayTeam.shortName || match.awayTeam.name}</ThemedText>
            </ThemedView>
          </ThemedView>
          
          {/* Maç Durumu ve Bilgileri */}
          <ThemedView style={styles.matchInfoContainer}>
            <ThemedView style={styles.matchInfoRow}>
              <ThemedText style={styles.matchInfoLabel}>Durum:</ThemedText>
              <ThemedView style={[
                styles.matchStatusBadge, 
                { backgroundColor: getMatchStatusColor(match.status || 'SCHEDULED') }
              ]}>
                <ThemedText style={styles.matchStatusText}>
                  {match.status === 'LIVE' || match.status === 'IN_PLAY' ? 'CANLI' : 
                   match.status === 'FINISHED' ? 'BİTTİ' : 
                   match.status === 'SCHEDULED' ? 'PLANLI' : match.status}
                </ThemedText>
              </ThemedView>
            </ThemedView>
            
            {match.venue && (
              <ThemedView style={styles.matchInfoRow}>
                <ThemedText style={styles.matchInfoLabel}>Stadyum:</ThemedText>
                <ThemedText style={styles.matchInfoValue}>{match.venue}</ThemedText>
              </ThemedView>
            )}
            
            {match.matchday && (
              <ThemedView style={styles.matchInfoRow}>
                <ThemedText style={styles.matchInfoLabel}>Maç Günü:</ThemedText>
                <ThemedText style={styles.matchInfoValue}>{match.matchday}</ThemedText>
              </ThemedView>
            )}
            
            {match.stage && (
              <ThemedView style={styles.matchInfoRow}>
                <ThemedText style={styles.matchInfoLabel}>Aşama:</ThemedText>
                <ThemedText style={styles.matchInfoValue}>{match.stage}</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>

        {/* Gol Detayları */}
        {match.goals && match.goals.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>⚽ Goller</ThemedText>
            {match.goals.map((goal, index) => (
              <ThemedView key={index} style={styles.goalRow}>
                <ThemedView style={styles.goalMinuteContainer}>
                <ThemedText style={styles.goalMinute}>{goal.minute}'</ThemedText>
                  {goal.injuryTime && goal.injuryTime > 0 && (
                    <ThemedText style={styles.injuryTime}>+{goal.injuryTime}'</ThemedText>
                  )}
                </ThemedView>
                <ThemedView style={styles.goalDetails}>
                <ThemedText style={styles.goalScorer}>{goal.scorer.name}</ThemedText>
                  <ThemedText style={styles.goalTeam}>{goal.team.shortName || goal.team.name}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.goalTypeContainer}>
                  <ThemedText style={styles.goalType}>{goal.type || 'Normal'}</ThemedText>
                  {goal.assist && (
                    <ThemedText style={styles.goalAssist}>Asist: {goal.assist.name}</ThemedText>
                  )}
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* Kart Detayları */}
        {match.bookings && match.bookings.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>🟨 Kartlar</ThemedText>
            {match.bookings.map((booking, index) => (
              <ThemedView key={index} style={styles.bookingRow}>
                <ThemedView style={styles.bookingMinuteContainer}>
                <ThemedText style={styles.bookingMinute}>{booking.minute}'</ThemedText>
                </ThemedView>
                <ThemedView style={styles.bookingDetails}>
                <ThemedText style={styles.bookingPlayer}>{booking.player.name}</ThemedText>
                  <ThemedText style={styles.bookingTeam}>{booking.team.shortName || booking.team.name}</ThemedText>
                </ThemedView>
                <ThemedView style={[
                  styles.bookingCardBadge,
                  { backgroundColor: booking.card === 'YELLOW' ? '#FFD700' : '#FF0000' }
                ]}>
                  <ThemedText style={styles.bookingCardText}>
                    {booking.card === 'YELLOW' ? '🟨' : '🟥'}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* Oyuncu Değişiklikleri */}
        {match.substitutions && match.substitutions.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>🔄 Oyuncu Değişiklikleri</ThemedText>
            {match.substitutions.map((sub, index) => (
              <ThemedView key={index} style={styles.substitutionRow}>
                <ThemedView style={styles.subMinuteContainer}>
                <ThemedText style={styles.subMinute}>{sub.minute}'</ThemedText>
                </ThemedView>
                <ThemedView style={styles.subDetails}>
                  <ThemedText style={styles.subTeam}>{sub.team.shortName || sub.team.name}</ThemedText>
                <ThemedText style={styles.subOut}>⬇️ {sub.playerOut.name}</ThemedText>
                <ThemedText style={styles.subIn}>⬆️ {sub.playerIn.name}</ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* Hakemler */}
        {match.referees && match.referees.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>👨‍⚖️ Hakemler</ThemedText>
            {match.referees.map((referee, index) => (
              <ThemedView key={index} style={styles.refereeRow}>
                <ThemedText style={styles.refereeRole}>{referee.role}:</ThemedText>
                <ThemedText style={styles.refereeName}>{referee.name}</ThemedText>
                <ThemedText style={styles.refereeNationality}>({referee.nationality})</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        {/* Maç İstatistikleri */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>📊 Maç İstatistikleri</ThemedText>
          <ThemedView style={styles.statsGrid}>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Maç Durumu</ThemedText>
              <ThemedText style={styles.statValue}>{match.status}</ThemedText>
            </ThemedView>
            
            {match.minute && (
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Dakika</ThemedText>
                <ThemedText style={styles.statValue}>{match.minute}'</ThemedText>
              </ThemedView>
            )}
            
            {match.injuryTime && match.injuryTime > 0 && (
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Uzatma</ThemedText>
                <ThemedText style={styles.statValue}>+{match.injuryTime}'</ThemedText>
              </ThemedView>
            )}
            
            {match.goals && (
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Toplam Gol</ThemedText>
                <ThemedText style={styles.statValue}>{match.goals.length}</ThemedText>
              </ThemedView>
            )}
            
            {match.bookings && (
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Toplam Kart</ThemedText>
                <ThemedText style={styles.statValue}>{match.bookings.length}</ThemedText>
              </ThemedView>
            )}
            
            {match.substitutions && (
              <ThemedView style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Oyuncu Değişikliği</ThemedText>
                <ThemedText style={styles.statValue}>{match.substitutions.length}</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    );
  };

  // Basit lig kartı komponenti - sadece logo ve isim
  const SimpleLeagueCard = ({ competition }: { competition: Competition }) => {
    return (
      <TouchableOpacity 
        style={styles.simpleLeagueCard}
        onPress={() => loadLeagueDetails(competition.code)}
      >
        <ThemedView style={styles.leagueLogoContainer}>
          {competition.emblem ? (
            <Image 
              source={{ uri: competition.emblem }} 
              style={styles.leagueLogo}
              resizeMode="contain"
            />
          ) : (
            <ThemedView style={styles.leagueLogoPlaceholder}>
              <ThemedText style={styles.leagueLogoText}>{competition.code}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
        <ThemedView style={styles.leagueInfo}>
          <ThemedText style={styles.leagueName}>{competition.name}</ThemedText>
          <ThemedText style={styles.leagueCode}>{competition.code}</ThemedText>
        </ThemedView>
        <ThemedText style={styles.arrowText}>→</ThemedText>
      </TouchableOpacity>
    );
  };

  // Takım detayları komponenti
  const TeamDetails = ({ team, onBack }: { team: Team; onBack: () => void }) => {
    return (
      <ThemedView style={styles.teamDetailsContainer}>
        <ThemedView style={styles.pageHeader}>
          <ThemedText style={styles.pageTitle}>👥 Takım Detayları</ThemedText>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ThemedText style={styles.backButtonIcon}>←</ThemedText>
            <ThemedText style={styles.backButtonText}>Geri</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Takım Bilgileri */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.teamHeader}>
            {team.crest && (
              <Image source={{ uri: team.crest }} style={styles.teamDetailCrest} resizeMode="contain" />
            )}
            <ThemedView style={styles.teamHeaderInfo}>
              <ThemedText style={styles.teamDetailName}>{team.name}</ThemedText>
              <ThemedText style={styles.teamDetailShortName}>{team.shortName}</ThemedText>
              {team.tla && <ThemedText style={styles.teamDetailTla}>{team.tla}</ThemedText>}
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.teamInfoGrid}>
            {team.founded && (
              <ThemedView style={styles.teamInfoItem}>
                <ThemedText style={styles.teamInfoLabel}>Kuruluş</ThemedText>
                <ThemedText style={styles.teamInfoValue}>{team.founded}</ThemedText>
              </ThemedView>
            )}
            
            {team.venue && (
              <ThemedView style={styles.teamInfoItem}>
                <ThemedText style={styles.teamInfoLabel}>Stadyum</ThemedText>
                <ThemedText style={styles.teamInfoValue}>{team.venue}</ThemedText>
              </ThemedView>
            )}
            
            {team.clubColors && (
              <ThemedView style={styles.teamInfoItem}>
                <ThemedText style={styles.teamInfoLabel}>Kulüp Renkleri</ThemedText>
                <ThemedText style={styles.teamInfoValue}>{team.clubColors}</ThemedText>
              </ThemedView>
            )}
            
            {team.website && (
              <ThemedView style={styles.teamInfoItem}>
                <ThemedText style={styles.teamInfoLabel}>Website</ThemedText>
                <ThemedText style={styles.teamInfoValue}>{team.website}</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ThemedView>

        {/* Teknik Direktör */}
        {team.coach && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>👨‍💼 Teknik Direktör</ThemedText>
            <ThemedView style={styles.coachInfo}>
              <ThemedView style={styles.coachAvatar}>
                <ThemedText style={styles.coachAvatarText}>
                  {team.coach.firstName?.charAt(0) || team.coach.name?.charAt(0) || 'T'}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.coachDetails}>
                <ThemedText style={styles.coachName}>{team.coach.name}</ThemedText>
                {team.coach.nationality && (
                  <ThemedText style={styles.coachNationality}>{team.coach.nationality}</ThemedText>
                )}
                {team.coach.dateOfBirth && (
                  <ThemedText style={styles.coachAge}>
                    {new Date().getFullYear() - new Date(team.coach.dateOfBirth).getFullYear()} yaş
                  </ThemedText>
                )}
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}

        {/* Kadro */}
        {team.squad && team.squad.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>⚽ Kadro ({team.squad.length} oyuncu)</ThemedText>
                        <ThemedView style={styles.squadGrid}>
              {(() => {
                const sortedPlayers = team.squad.sort((a, b) => {
                  const orderA = getPositionOrder(a.position || '');
                  const orderB = getPositionOrder(b.position || '');
                  if (orderA !== orderB) return orderA - orderB;
                  return (a.name || '').localeCompare(b.name || '');
                });

                const groupedPlayers = sortedPlayers.reduce((groups, player) => {
                  const position = player.position || '';
                  const order = getPositionOrder(position);
                  const key = order;
                  if (!groups[key]) groups[key] = [];
                  groups[key].push(player);
                  return groups;
                }, {} as Record<number, any[]>);

                return Object.entries(groupedPlayers).map(([order, players]) => (
                  <ThemedView key={order} style={styles.positionSection}>
                    <ThemedText style={styles.positionTitle}>
                      {getPositionTitle(players[0]?.position || '')} ({players.length})
                    </ThemedText>
                    <ThemedView style={styles.positionPlayers}>
                      {players.map((player, index) => (
                        <TouchableOpacity key={player.id || index} style={styles.playerCard}>
                          {/* Oyuncu Avatar */}
                          <ThemedView style={styles.playerPhotoContainer}>
                            <ThemedView style={styles.playerPhoto}>
                              <ThemedText style={styles.playerPhotoText}>
                                {player.firstName?.charAt(0) || player.name?.charAt(0) || '?'}
                              </ThemedText>
                            </ThemedView>
                            {player.shirtNumber && (
                              <ThemedView style={styles.playerNumberBadge}>
                                <ThemedText style={styles.playerNumberText}>{player.shirtNumber}</ThemedText>
                              </ThemedView>
                            )}
                          </ThemedView>
                          
                          {/* Oyuncu Bilgileri */}
                          <ThemedView style={styles.playerInfo}>
                            <ThemedText style={styles.playerName} numberOfLines={2}>
                              {player.name}
                            </ThemedText>
                            {player.position && (
                              <ThemedText style={[styles.playerPosition, getPositionStyle(player.position)]}>
                                {getPositionAbbreviation(player.position)}
                              </ThemedText>
                            )}
                            {player.nationality && (
                              <ThemedText style={styles.playerNationality}>{player.nationality}</ThemedText>
                            )}
                            {player.dateOfBirth && (
                              <ThemedText style={styles.playerAge}>
                                {new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear()} yaş
                              </ThemedText>
                            )}
                            {player.shirtNumber && (
                              <ThemedText style={styles.playerNumber}>#{player.shirtNumber}</ThemedText>
                            )}
                          </ThemedView>
                        </TouchableOpacity>
                      ))}
                    </ThemedView>
                  </ThemedView>
                ));
              })()}
            </ThemedView>
          </ThemedView>
        )}

        {/* Aktif Ligler */}
        {team.runningCompetitions && team.runningCompetitions.length > 0 && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>🏆 Aktif Ligler</ThemedText>
            {team.runningCompetitions.map((competition, index) => (
              <ThemedView key={competition.id || index} style={styles.competitionItem}>
                {competition.emblem && (
                  <Image source={{ uri: competition.emblem }} style={styles.competitionEmblem} resizeMode="contain" />
                )}
                <ThemedView style={styles.competitionInfo}>
                  <ThemedText style={styles.competitionName}>{competition.name}</ThemedText>
                  <ThemedText style={styles.competitionCode}>{competition.code}</ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        )}
      </ThemedView>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Tab Menüsü */}
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leagues' && styles.activeTab]}
          onPress={() => setActiveTab('leagues')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'leagues' && styles.activeTabText]}>
            🏆 Ligler
          </ThemedText>
        </TouchableOpacity>
        
                <TouchableOpacity 
          style={[styles.tab, activeTab === 'teams' && styles.activeTab]}
          onPress={() => setActiveTab('teams')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'teams' && styles.activeTabText]}>
            👥 Takımlar
              </ThemedText>
              </TouchableOpacity>
            </ThemedView>

      {/* Maçlar Tab'ı kaldırıldı */}

      {/* Ligler Tab'ı */}
      {activeTab === 'leagues' && (
        <ThemedView style={styles.tabContent}>
          {selectedTeam ? (
            // Takım detayları - öncelik takımda
            <TeamDetails team={selectedTeam} onBack={() => setSelectedTeam(null)} />
          ) : selectedMatch ? (
            // Maç detayları
            <MatchDetails match={selectedMatch} onBack={() => setSelectedMatch(null)} />
          ) : !selectedLeague ? (
            // Lig listesi
            <>
              <ThemedView style={styles.pageHeader}>
                <ThemedText style={styles.pageTitle}>🏆 Ligler</ThemedText>
                <TouchableOpacity 
                  style={styles.refreshButton} 
                  onPress={loadCompetitions}
                  disabled={loading.competitions}
                >
                  <ThemedText style={styles.refreshButtonText}>
                    {loading.competitions ? '⏳' : '⚡'}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
              
              {loading.competitions ? (
                <ThemedView style={styles.loadingContainer}>
                  <ThemedText>Ligler yükleniyor...</ThemedText>
                </ThemedView>
              ) : (
                <ThemedView style={styles.leaguesGrid}>
                  {competitions
                    .filter(competition => competition.type === 'LEAGUE')
                    .map(competition => (
                    <TouchableOpacity
                      key={competition.id}
                      style={styles.leagueCard}
                      onPress={() => loadLeagueDetails(competition.code)}
                    >
                      <ThemedView style={styles.leagueCardHeader}>
                        {competition.emblem && (
                          <Image 
                            source={{ uri: competition.emblem }} 
                            style={styles.leagueCardEmblem}
                            resizeMode="contain"
                            key={`league-${competition.id}-${competition.emblem}`}
                            onLoadStart={() => {}}
                            onLoadEnd={() => {}}
                            onError={() => {}}
                            fadeDuration={0}
                          />
                        )}
                        <ThemedText style={styles.leagueCardName}>
                          {competition.name}
                        </ThemedText>
                      </ThemedView>
                      
                      <ThemedView style={styles.leagueCardInfo}>
                        <ThemedText style={styles.leagueCardType}>
                          Lig • {competition.plan === 'TIER_ONE' ? 'Üst Düzey' : 
                                 competition.plan === 'TIER_TWO' ? 'İkinci Düzey' :
                                 competition.plan === 'TIER_THREE' ? 'Üçüncü Düzey' :
                                 competition.plan === 'TIER_FOUR' ? 'Dördüncü Düzey' :
                                 competition.plan || 'Bilinmeyen'}
                        </ThemedText>
                      </ThemedView>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              )}
            </>
          ) : (
            // Lig detayları
            <>
              <ThemedView style={styles.pageHeader}>
                <ThemedView style={styles.leagueHeader}>
                  {leagueDetails.competition?.emblem && (
                    <Image 
                      source={{ uri: leagueDetails.competition.emblem }} 
                      style={styles.leagueEmblem}
                      resizeMode="contain"
                    />
                  )}
                </ThemedView>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setSelectedLeague('')}
                >
                  <ThemedText style={styles.backButtonIcon}>←</ThemedText>
            <ThemedText style={styles.backButtonText}>Geri</ThemedText>
                </TouchableOpacity>
              </ThemedView>

              {leagueDetails.loading ? (
                <ThemedView style={styles.loadingContainer}>
                  <ThemedText style={styles.loadingText}>
                    Lig detayları yükleniyor...
                  </ThemedText>
                  <ThemedText style={styles.loadingSubtext}>
                    Puan durumu, gol krallığı ve takım bilgileri alınıyor
                  </ThemedText>
                  <ThemedText style={styles.loadingSubtext}>
                    Bu işlem 10-15 saniye sürebilir
                  </ThemedText>
                </ThemedView>
              ) : (
                <ThemedView style={styles.leagueDetailsContainer}>
                  {/* Puan Durumu */}
                  {leagueDetails.standings.length > 0 ? (
                    <ThemedView style={styles.section}>
                      <ThemedText style={styles.sectionTitle}>📊 Puan Durumu</ThemedText>
                      
                                             {/* Standings Header */}
                       <ThemedView style={styles.standingsHeader}>
                         <ThemedText style={styles.headerSira}>Sıra</ThemedText>
                         <ThemedText style={styles.headerTakim}>Takım</ThemedText>
                         <ThemedText style={styles.headerStat}>O</ThemedText>
                         <ThemedText style={styles.headerStat}>G</ThemedText>
                         <ThemedText style={styles.headerStat}>B</ThemedText>
                         <ThemedText style={styles.headerStat}>M</ThemedText>
                         <ThemedText style={styles.headerStat}>A</ThemedText>
                         <ThemedText style={styles.headerStat}>Y</ThemedText>
                         <ThemedText style={styles.headerStat}>Av</ThemedText>
                         <ThemedText style={styles.headerStat}>P</ThemedText>
                       </ThemedView>
                      
                      {leagueDetails.standings.map((standing, index) => (
                        <TouchableOpacity 
                          key={standing.team?.id || index} 
                          style={styles.standingRow}
                          onPress={() => setSelectedTeam(standing.team)}
                        >
                          <ThemedView style={styles.standingPosition}>
                            <ThemedText style={styles.position}>
                              {standing.position}
                            </ThemedText>
                          </ThemedView>
                          
                          <ThemedView style={styles.standingTeamInfo}>
                            {standing.team?.crest && (
                              <Image 
                                source={{ uri: standing.team.crest }} 
                                style={styles.standingTeamCrest}
                                resizeMode="contain"
                              />
                            )}
                            <ThemedText style={styles.standingTeamName} numberOfLines={1}>
                              {standing.team?.shortName || standing.team?.name || 'Bilinmeyen Takım'}
                            </ThemedText>
                          </ThemedView>
                          
                                                                                <ThemedView style={styles.standingStats}>
                             <ThemedText style={styles.statO}>{standing.playedGames}</ThemedText>
                             <ThemedText style={styles.statG}>{standing.won}</ThemedText>
                             <ThemedText style={styles.statB}>{standing.draw}</ThemedText>
                             <ThemedText style={styles.statM}>{standing.lost}</ThemedText>
                             <ThemedText style={styles.statA}>{standing.goalsFor}</ThemedText>
                             <ThemedText style={styles.statY}>{standing.goalsAgainst}</ThemedText>
                             <ThemedText style={styles.statAv}>{standing.goalDifference}</ThemedText>
                             <ThemedText style={styles.statP}>{standing.points}</ThemedText>
                          </ThemedView>
                        </TouchableOpacity>
                      ))}
                    </ThemedView>
                  ) : (
                    <ThemedView style={styles.section}>
                      <ThemedText style={styles.sectionTitle}>📊 Puan Durumu</ThemedText>
                      <ThemedText style={styles.noDataText}>
                        Puan durumu bulunamadı. Bu lig için henüz sezon başlamamış olabilir.
                      </ThemedText>
                      <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={() => loadLeagueDetails(selectedLeague)}
                      >
                        <ThemedText style={styles.retryButtonText}>🔄 Tekrar Dene</ThemedText>
                      </TouchableOpacity>
                    </ThemedView>
                  )}

                  

                  {/* Gol Krallığı */}
                  {leagueDetails.topScorers.length > 0 && (
                    <ThemedView style={styles.section}>
                      <ThemedText style={styles.sectionTitle}>⚽ Gol Krallığı</ThemedText>
                      {leagueDetails.topScorers.map((scorer, index) => (
                        <ThemedView key={scorer.player?.id || index} style={styles.scorerRow}>
                          <ThemedView style={styles.scorerInfo}>
                            <ThemedText style={styles.scorerPosition}>{index + 1}</ThemedText>
                            <ThemedText style={styles.scorerName} numberOfLines={1}>
                              {scorer.player?.name}
                            </ThemedText>
                          </ThemedView>
                          <ThemedView style={styles.scorerStats}>
                            <ThemedText style={styles.scorerGoals}>{scorer.goals}</ThemedText>
                          </ThemedView>
                        </ThemedView>
                      ))}
                    </ThemedView>
                  )}

                  {/* Takımlar */}
                  {leagueDetails.teams.length > 0 && (
                    <ThemedView style={styles.section}>
                      <ThemedText style={styles.sectionTitle}>👥 Takımlar</ThemedText>
                      <ThemedView style={styles.teamsGrid}>
                        {leagueDetails.teams.map(team => (
                          <ThemedView key={team.id} style={styles.teamCard}>
                                                    {team.crest && (
                          <Image 
                            source={{ uri: team.crest }} 
                            style={styles.teamCardCrest}
                            resizeMode="contain"
                          />
                        )}
                            <ThemedText style={styles.teamName} numberOfLines={1}>
                              {team.name}
                            </ThemedText>
                          </ThemedView>
                        ))}
                      </ThemedView>
                    </ThemedView>
                  )}

                  {/* Son Maçlar */}
                  {leagueDetails.matches.length > 0 && (
                    <ThemedView style={styles.section}>
                      <ThemedText style={styles.sectionTitle}>⚽ Son Maçlar</ThemedText>
                      {leagueDetails.matches.slice(0, 5).map(match => (
                        <ThemedView key={match.id} style={styles.recentMatchCard}>
                          <ThemedView style={styles.recentMatchHeader}>
                            <ThemedText style={styles.recentMatchCompetition}>
                              {match.competition?.name || 'Bilinmeyen Lig'}
                            </ThemedText>
                            <ThemedView style={[
                              styles.recentMatchStatus, 
                              { backgroundColor: getMatchStatusColor(match.status || 'SCHEDULED') }
                            ]}>
                              <ThemedText style={styles.recentMatchStatusText}>
                                {match.status === 'LIVE' || match.status === 'IN_PLAY' ? 'CANLI' : 
                                 match.status === 'FINISHED' ? 'BİTTİ' : 
                                 match.status === 'SCHEDULED' ? 'PLANLI' : match.status}
                              </ThemedText>
                            </ThemedView>
                          </ThemedView>
                          
                          <ThemedView style={styles.recentMatchContent}>
                            <ThemedView style={styles.recentMatchTeam}>
                              {match.homeTeam?.crest && (
                                <Image 
                                  source={{ uri: match.homeTeam.crest }} 
                                  style={styles.recentMatchTeamCrest}
                                  resizeMode="contain"
                                />
                              )}
                              <ThemedText style={styles.recentMatchTeamName} numberOfLines={1}>
                                {match.homeTeam?.shortName || match.homeTeam?.name || 'Ev Sahibi'}
                              </ThemedText>
                            </ThemedView>
                            
                            <ThemedView style={styles.recentMatchVsContainer}>
                              {match.score?.fullTime?.home !== null && match.score?.fullTime?.away !== null ? (
                                <ThemedText style={styles.recentMatchScore}>
                                  {match.score.fullTime.home} - {match.score.fullTime.away}
                                </ThemedText>
                              ) : (
                                <ThemedText style={styles.recentMatchVs}>VS</ThemedText>
                              )}
                              <ThemedText style={styles.recentMatchTime}>
                                {match.utcDate ? convertToTurkeyTime(match.utcDate) : 'Tarih bilinmiyor'}
                              </ThemedText>
                            </ThemedView>
                            
                            <ThemedView style={styles.recentMatchTeam}>
                              {match.awayTeam?.crest && (
                                <Image 
                                  source={{ uri: match.awayTeam.crest }} 
                                  style={styles.recentMatchTeamCrest}
                                  resizeMode="contain"
                                />
                              )}
                              <ThemedText style={styles.recentMatchTeamName} numberOfLines={1}>
                                {match.awayTeam?.shortName || match.awayTeam?.name || 'Misafir'}
                              </ThemedText>
                            </ThemedView>
                          </ThemedView>
                          
                          {/* Maç detayları butonu kaldırıldı - API'den veri çekilemiyor */}
                        </ThemedView>
                      ))}
                    </ThemedView>
                  )}
                </ThemedView>
              )}
            </>
          )}
        </ThemedView>
      )}

      {/* Takımlar Tab'ı */}
      {activeTab === 'teams' && (
        <ThemedView style={styles.tabContent}>
          {selectedTeam ? (
            // Takım detayları
            <TeamDetails team={selectedTeam} onBack={() => setSelectedTeam(null)} />
          ) : selectedLeague ? (
            // Lig seçildiğinde takım listesini göster
            <>
              <ThemedView style={styles.pageHeader}>
                <ThemedView style={styles.leagueHeader}>
                  {leagueDetails.competition?.emblem && (
                    <Image 
                      source={{ uri: leagueDetails.competition.emblem }} 
                      style={styles.leagueEmblem}
                      resizeMode="contain"
                    />
                  )}
                </ThemedView>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setSelectedLeague('')}
                >
                  <ThemedText style={styles.backButtonIcon}>←</ThemedText>
            <ThemedText style={styles.backButtonText}>Geri</ThemedText>
                </TouchableOpacity>
              </ThemedView>

              {leagueDetails.loading ? (
                <ThemedView style={styles.loadingContainer}>
                  <ThemedText style={styles.loadingText}>Takımlar yükleniyor...</ThemedText>
                  <ThemedText style={styles.loadingSubtext}>
                    Bu işlem 10-15 saniye sürebilir
                  </ThemedText>
                </ThemedView>
              ) : leagueDetails.teams.length > 0 ? (
                <ThemedView style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>👥 {leagueDetails.competition?.name} Takımları</ThemedText>
                  <ThemedView style={styles.teamsGrid}>
                    {leagueDetails.teams.map(team => (
                      <TouchableOpacity
                        key={team.id}
                        style={styles.teamCard}
                        onPress={() => setSelectedTeam(team)}
                      >
                        {team.crest && (
                          <Image 
                            source={{ uri: team.crest }} 
                            style={styles.teamCardCrest}
                            resizeMode="contain"
                          />
                        )}
                        <ThemedText style={styles.teamName} numberOfLines={2}>
                          {team.name}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ThemedView>
                </ThemedView>
              ) : (
                <ThemedView style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>👥 Takımlar</ThemedText>
                  <ThemedText style={styles.noDataText}>
                    Bu lig için takım bulunamadı. Lütfen tekrar deneyin.
                  </ThemedText>
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => loadLeagueDetails(selectedLeague)}
                  >
                    <ThemedText style={styles.retryButtonText}>🔄 Tekrar Dene</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              )}
            </>
          ) : (
            // Lig listesi
            <>
              <ThemedView style={styles.pageHeader}>
                <ThemedText style={styles.pageTitle}>👥 Takımlar</ThemedText>
                <TouchableOpacity 
                  style={styles.refreshButton} 
                  onPress={loadCompetitions}
                  disabled={loading.competitions}
                >
                  <ThemedText style={styles.refreshButtonText}>
                    {loading.competitions ? '⏳' : '⚡'}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
              
              {loading.competitions ? (
                <ThemedView style={styles.loadingContainer}>
                  <ThemedText style={styles.loadingText}>Ligler yükleniyor...</ThemedText>
                </ThemedView>
              ) : (
                <ThemedView style={styles.leaguesGrid}>
                  {competitions
                    .filter(competition => competition.type === 'LEAGUE')
                    .map(competition => (
                    <TouchableOpacity
                      key={competition.id}
                      style={styles.leagueCard}
                      onPress={() => loadLeagueDetails(competition.code)}
                    >
                      <ThemedView style={styles.leagueCardHeader}>
                        {competition.emblem && (
                          <Image 
                            source={{ uri: competition.emblem }} 
                            style={styles.leagueCardEmblem}
                            resizeMode="contain"
                            key={`team-league-${competition.id}-${competition.emblem}`}
                            onLoadStart={() => {}}
                            onLoadEnd={() => {}}
                            onError={() => {}}
                            fadeDuration={0}
                          />
                        )}
                        <ThemedText style={styles.leagueCardName}>
                          {competition.name}
                        </ThemedText>
                      </ThemedView>
                      
                      <ThemedView style={styles.leagueCardInfo}>
                        <ThemedText style={styles.leagueCardType}>
                          Lig • {competition.plan === 'TIER_ONE' ? 'Üst Düzey' : 
                                 competition.plan === 'TIER_TWO' ? 'İkinci Düzey' :
                                 competition.plan === 'TIER_THREE' ? 'Üçüncü Düzey' :
                                 competition.plan === 'TIER_FOUR' ? 'Dördüncü Düzey' :
                                 competition.plan || 'Bilinmeyen'}
                        </ThemedText>
                      </ThemedView>
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              )}
            </>
          )}
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8e8e93',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  leagueHeader: {
    flexDirection: 'column', // Dikey olarak değiştirildi
    alignItems: 'flex-start', // Sola yaslı
    gap: 16, // Daha fazla boşluk
  },
  leagueEmblem: {
    width: 200, // Daha da büyük
    height: 200, // Daha da büyük
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 48, // 2 kat artırıldı (24 * 2)
  },
  section: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 36, // 2 kat artırıldı (18 * 2)
    marginBottom: 16, // Ekstra boşluk
  },
  refreshButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  refreshButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  matchCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  competitionName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  vsContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  vsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  minuteText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
    marginTop: 4,
  },
  matchTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  leaguesGrid: {
    gap: 16,
  },
  leagueCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginHorizontal: 20,
  },
  leagueCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 16,
  },
  leagueCardEmblem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f8ff',
    borderWidth: 2,
    borderColor: '#e3f2fd',
  },
  leagueCardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    lineHeight: 24,
  },
  leagueCardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  leagueCardCountry: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  leagueCardType: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  leagueName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  leagueCode: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  leagueContent: {
    gap: 16,
  },
  standingsSection: {
    gap: 8,
  },
  scorersSection: {
    gap: 8,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 16, // 2 kat artırıldı (8 * 2)
    lineHeight: 28, // 2 kat artırıldı (14 * 2)
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 20,
    paddingLeft: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginHorizontal: 0,
  },
  position: {
    width: 24,
    fontWeight: '600',
    fontSize: 12,
    color: '#666',
  },
  standingTeamName: {
    flex: 1,
    fontSize: 12,
    marginLeft: 8,
    color: '#1a1a1a',
  },
  points: {
    width: 24,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    color: '#007AFF',
  },
  scorerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scorerPosition: {
    width: 24,
    fontWeight: '600',
    fontSize: 12,
    color: '#666',
  },
  scorerName: {
    flex: 1,
    fontSize: 12,
    marginLeft: 8,
    color: '#1a1a1a',
  },
  scorerGoals: {
    width: 24,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    color: '#FF6B35',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  // Yeni eklenen style'lar
  leagueLogoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  leagueLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  leagueLogoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leagueLogoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teamCrest: {
    width: 30, // 1.5 kat büyütüldü
    height: 30, // 1.5 kat büyütüldü
    marginLeft: 8,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playedGames: {
    fontSize: 12,
    color: '#666',
    minWidth: 20,
    textAlign: 'center',
  },
  scorerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerPhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 8,
    marginRight: 8,
  },
  scorerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scorerAssists: {
    fontSize: 12,
    color: '#666',
    minWidth: 20,
    textAlign: 'center',
  },
  viewDetailsButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Yeni basit lig kartı style'ları
  simpleLeagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leagueInfo: {
    flex: 1,
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  leagueDetailsContainer: {
    gap: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 122, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  backButtonIcon: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 122, 255, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
  },
  teamsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  teamCard: {
    width: (width - 150) / 3, // 4 sütun, daha küçük genişlik
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  // Takım kartı için ayrı armalar
  teamCardCrest: {
    width: 24, // Daha da küçük logo
    height: 24, // Daha da küçük logo
    marginBottom: 2,
  },
  // Maç detayları style'ları
  matchDetailsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  goalMinuteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalMinute: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  injuryTime: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 4,
  },
  goalDetails: {
    flex: 1,
    marginLeft: 12,
  },
  goalScorer: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  goalTeam: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  goalTypeContainer: {
    marginTop: 4,
  },
  goalType: {
    fontSize: 12,
    color: '#666',
  },
  goalAssist: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bookingMinuteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingMinute: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9500',
  },
  bookingDetails: {
    flex: 1,
    marginLeft: 12,
  },
  bookingPlayer: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  bookingTeam: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bookingCardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookingCardText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  substitutionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subMinuteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subMinute: {
    width: 40,
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  subDetails: {
    flex: 1,
    marginLeft: 12,
  },
  subTeam: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  subOut: {
    fontSize: 14,
    color: '#FF3B30',
  },
  subIn: {
    fontSize: 14,
    color: '#34C759',
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  leagueInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  leagueInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 12,
    minWidth: 80,
  },
  leagueInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  debugButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Recent match styles
  recentMatchCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recentMatchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentMatchCompetition: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  recentMatchStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recentMatchStatusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  recentMatchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recentMatchTeam: {
    flex: 1,
    alignItems: 'center',
  },
  recentMatchTeamCrest: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },
  recentMatchTeamName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  recentMatchVsContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  recentMatchScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  recentMatchVs: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  recentMatchTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  // Maç detayları butonu style'ları kaldırıldı
  matchInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  matchInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  matchInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 8,
  },
  matchInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  matchStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchStatusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    minWidth: '45%', // 2 sütunlu grid
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  refereeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  refereeRole: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 8,
  },
  refereeName: {
    fontSize: 14,
    color: '#1a1a1a',
    flex: 1,
  },
  refereeNationality: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  // Yeni eklenen style'lar
  standingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 25,
    marginHorizontal: 15,
    paddingLeft: 40,
  },
  standingsHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  standingPosition: {
    width: 30,
    alignItems: 'flex-start',
    paddingLeft: 1,
  },
  standingTeamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    marginLeft: 6,
  },
  standingTeamCrest: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  standingTeamName: {
    fontSize: 12,
    color: '#1a1a1a',
    flex: 1,
  },
  standingStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingRight: 16,
  },
  standingStat: {
    fontSize: 12,
    color: '#666',
    width: 30,
    textAlign: 'center',
  },
  standingPoints: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    width: 30,
    textAlign: 'center',
  },
  headerColumn: {
    width: 30,
    alignItems: 'center',
  },
  statColumn: {
    width: 30,
    alignItems: 'center',
  },
  headerSira: {
    width: 22,
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textAlign: 'left',
    paddingLeft: 0,
  },
  headerTakim: {
    width: 120,
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textAlign: 'left',
    marginLeft: 0,
  },
  headerStat: {
    width: 22,
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    paddingLeft: -6,
  },
  statO: {
    width: 22,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  statG: {
    width: 22,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  statB: {
    width: 22,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  statM: {
    width: 22,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  statA: {
    width: 22,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  statY: {
    width: 22,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  statAv: {
    width: 22,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  statP: {
    width: 22,
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  championsLeagueRow: {
    backgroundColor: '#e0f2f7', // Mavi tonları
  },
  europaLeagueRow: {
    backgroundColor: '#f0f0f0', // Açık gri tonları
  },
  relegationRow: {
    backgroundColor: '#f7e0e0', // Kırmızı tonları
  },
  // Takım detayları style'ları
  teamDetailsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e3f2fd',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  teamDetailCrest: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    borderWidth: 3,
    borderColor: '#e3f2fd',
    backgroundColor: '#f0f8ff',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  teamHeaderInfo: {
    flex: 1,
    paddingVertical: 4,
  },
  teamDetailName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 30,
  },
  teamDetailShortName: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 6,
    fontWeight: '600',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  teamDetailTla: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  teamInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  teamInfoItem: {
    flex: 1,
    minWidth: '45%', // 2 sütunlu grid
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e3f2fd',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 8,
  },
  teamInfoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  teamInfoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 24,
  },
  coachInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e3f2fd',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  coachAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderWidth: 4,
    borderColor: '#e3f2fd',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  coachAvatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  coachDetails: {
    flex: 1,
    paddingVertical: 4,
  },
  coachAge: {
    fontSize: 15,
    color: '#007AFF',
    marginTop: 6,
    fontWeight: '600',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  coachName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 26,
  },
  coachNationality: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  squadGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  positionSection: {
    marginBottom: 8,
  },
  positionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  positionPlayers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  playerCard: {
    width: (width - 160) / 2, // 2 sütun - daha geniş kartlar
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e3f2fd',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 6,
  },
  playerPhotoContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  playerPhoto: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    borderWidth: 2,
    borderColor: '#e3f2fd',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  playerPhotoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  playerNumberBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  playerNumberText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  playerInfo: {
    alignItems: 'center',
    width: '100%',
  },
  playerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  playerPosition: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    textAlign: 'center',
    minWidth: 28,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // FIFA tarzı pozisyon renkleri
  positionGK: { // Kaleci
    backgroundColor: '#FF6B6B',
    color: 'white',
  },
  positionCB: { // Stoper
    backgroundColor: '#4ECDC4',
    color: 'white',
  },
  positionLB: { // Sol bek
    backgroundColor: '#45B7D1',
    color: 'white',
  },
  positionRB: { // Sağ bek
    backgroundColor: '#45B7D1',
    color: 'white',
  },
  positionDM: { // Defansif orta saha
    backgroundColor: '#96CEB4',
    color: 'white',
  },
  positionCM: { // Orta saha
    backgroundColor: '#FFEAA7',
    color: '#2D3436',
  },
  positionAM: { // Hücum orta saha
    backgroundColor: '#DDA0DD',
    color: 'white',
  },
  positionLW: { // Sol kanat
    backgroundColor: '#FF8C42',
    color: 'white',
  },
  positionRW: { // Sağ kanat
    backgroundColor: '#FF8C42',
    color: 'white',
  },
  positionST: { // Forvet
    backgroundColor: '#FF4757',
    color: 'white',
  },
  positionCF: { // Santrafor
    backgroundColor: '#FF4757',
    color: 'white',
  },
  playerNationality: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  playerAge: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    fontWeight: '500',
  },
  playerNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginTop: 3,
  },
  competitionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e3f2fd',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  competitionEmblem: {
    width: 36,
    height: 36,
    marginRight: 16,
    borderRadius: 18,
    backgroundColor: '#f0f8ff',
    borderWidth: 2,
    borderColor: '#e3f2fd',
  },
  competitionInfo: {
    flex: 1,
    paddingVertical: 2,
  },
  competitionName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 24,
  },
  competitionCode: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  standingsLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  championsLeaguePosition: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  europaLeaguePosition: {
    color: '#FF9500',
    fontWeight: 'bold',
  },
  relegationPosition: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  championsLeagueRow: {
    backgroundColor: '#e0f2f7',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  europaLeagueRow: {
    backgroundColor: '#f0f0f0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  relegationRow: {
    backgroundColor: '#f7e0e0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
});